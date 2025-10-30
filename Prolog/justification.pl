%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Geração de explicações do tipo "Como"

como_json(PatientID, N, TextStr) :-
    % retrieve airway difficulty status once
    (   once(facto(PatientID, _, via_aerea_dificil(Status)))
    ->  true
    ;   Status = unknown
    ),
    with_output_to(atom(TextAtom),
        (   (   como(PatientID, N, 0, Status)
            ->  true
            ;   true
            )
        )
    ),
    atom_string(TextAtom, TextStr).

% Caso base (4-arg version)
como(PatientID, N, Status) :-
    como(PatientID, N, 0, Status).

% Caso o facto não exista
como(PatientID, N, _, _) :-
    ultimo_facto(PatientID, Last),
    Last < N, !,
    nl, write('That conclusion was not yet reached.'), nl, nl.

% Caso o facto seja derivado
como(PatientID, N, Depth, Status) :-
    justifica(PatientID, N, RegraID, LFactos), !,
    facto(PatientID, N, F),
    F =.. [Pred | Args],
    junta_argumentos(Args, ArgsStr),
    tab(Depth * 2),
    format('[~w] (rule ~w) -> ~n', [ArgsStr, RegraID]),
    NextDepth is Depth + 1,
    explica(PatientID, LFactos, NextDepth, Status),

    (   Pred == mnemonica_cf,
        Args = [Mnemonica, _CF]
    ->  
        tab(NextDepth * 2),
        (   Status == true ->
            write('Airway assessment: difficult'), nl
        ;   Status == false ->
            write('Airway assessment: normal'), nl
        ;   true
        ),
        mostra_fatores(PatientID, Mnemonica, NextDepth)
    ;   true
    ).

% Caso o facto seja inicial
como(PatientID, N, Depth, Status) :-
    facto(PatientID, N, F),
    F =.. [Pred | Args],
    junta_argumentos(Args, ArgsStr),
    tab(Depth * 2),
    format('~w = ~w~n', [Pred, ArgsStr]),

    (   Pred == mnemonica_cf,
        Args = [Mnemonica, _CF]
    ->  
        tab((Depth + 1) * 2),
        (   Status == true ->
            write('Airway assessment: difficult'), nl
        ;   Status == false ->
            write('Airway assessment: normal'), nl
        ;   true
        ),
        mostra_fatores(PatientID, Mnemonica, Depth + 1)
    ;   true
    ).

explica(_, [], _, _).
explica(PatientID, [I | R], Depth, Status) :-
    integer(I), !,
    como(PatientID, I, Depth, Status),
    explica(PatientID, R, Depth, Status).
    
explica(PatientID, [_ | R], Depth, Status) :-
    explica(PatientID, R, Depth, Status).

% Obter todos os fatores de cada mnemonica
mostra_fatores(PatientID, Mnemonica0, Depth) :-
    term_to_atom(Mnemonica0, Mn),
    findall(Let-Val,
        (   facto(PatientID, _, fator(MnX, [Let, Val])),
            term_to_atom(MnX, Mn)
        ),
        Pairs),
    forall(member(Let-Val, Pairs),
        (   tab(Depth * 4),
            format('~w -> ~w~n', [Let, Val])
        )).

% Obter lista de argumentos no caso dos fatores
junta_argumentos(Argumentos, TextoSaida) :-
    maplist(arg_para_texto, Argumentos, ListaAtomos),
    atomic_list_concat(ListaAtomos, ' = ', TextoSaida).

arg_para_texto(Arg, Texto) :-
    (   is_list(Arg)
    ->  maplist(term_to_atom, Arg, Internos),
        atomic_list_concat(Internos, ', ', InternosTxt),
        format(atom(Texto), '[~w]', [InternosTxt])
    ;   term_to_atom(Arg, Texto)
    ).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Geração de explicações do tipo "Porque nao"
% Exemplo: ?- whynot(classe(meu_veículo,ligeiro)).

whynot(PatientID, Facto):-
	whynot(PatientID, Facto,1).

whynot(PatientID, Facto,_):-
	facto(PatientID, _, Facto),
	!,
	write('O facto '),write(Facto),write(' não é falso!'),nl.
whynot(PatientID, Facto,Nivel):-
	encontra_regras_whynot(PatientID,Facto,LLPF),
	whynot1(LLPF,Nivel).
whynot(_, nao Facto,Nivel):-
	formata(Nivel),write('Porque:'),write(' O facto '),write(Facto),
	write(' é verdadeiro'),nl.
whynot(_, Facto,Nivel):-
	formata(Nivel),write('Porque:'),write(' O facto '),write(Facto),
	write(' não está definido na base de conhecimento'),nl.

%  As explicações do whynot(Facto) devem considerar todas as regras que poderiam dar origem a conclusão relativa ao facto Facto

encontra_regras_whynot(PatientID,Facto,LLPF):-
	findall((ID,LPF),
		(
		regra ID se LHS entao RHS,
		member(cria_facto(Facto),RHS),
		encontra_premissas_falsas(PatientID,LHS,LPF),
		LPF \== []
		),
		LLPF).

whynot1([],_).
whynot1([(ID,LPF)|LLPF],Nivel):-
	formata(Nivel),write('Porque pela regra '),write(ID),write(':'),nl,
	Nivel1 is Nivel+1,
	explica_porque_nao(LPF,Nivel1),
	whynot1(LLPF,Nivel).

encontra_premissas_falsas(PatientID,[nao X e Y], LPF):-
	verifica_condicoes(PatientID,[nao X], _),
	!,
	encontra_premissas_falsas(PatientID,[Y], LPF).
encontra_premissas_falsas(PatientID,[X e Y], LPF):-
	verifica_condicoes(PatientID,[X], _),
	!,
	encontra_premissas_falsas(PatientID,[Y], LPF).
encontra_premissas_falsas(PatientID,[nao X], []):-
	verifica_condicoes(PatientID,[nao X], _),
	!.
encontra_premissas_falsas(PatientID,[X], []):-
	verifica_condicoes(PatientID,[X], _),
	!.
encontra_premissas_falsas(PatientID,[nao X e Y], [nao X|LPF]):-
	!,
	encontra_premissas_falsas(PatientID,[Y], LPF).
encontra_premissas_falsas(PatientID,[X e Y], [X|LPF]):-
	!,
	encontra_premissas_falsas(PatientID,[Y], LPF).
encontra_premissas_falsas(_,[nao X], [nao X]):-!.
encontra_premissas_falsas(_,[X], [X]).
encontra_premissas_falsas(_,[]).

explica_porque_nao([],_).
explica_porque_nao([nao avalia(X)|LPF],Nivel):-
	!,
	formata(Nivel),write('A condição nao '),write(X),write(' é falsa'),nl,
	explica_porque_nao(LPF,Nivel).
explica_porque_nao([avalia(X)|LPF],Nivel):-
	!,
	formata(Nivel),write('A condição '),write(X),write(' é falsa'),nl,
	explica_porque_nao(LPF,Nivel).
explica_porque_nao([P|LPF],Nivel):-
	formata(Nivel),write('A premissa '),write(P),write(' é falsa'),nl,
	Nivel1 is Nivel+1,
	whynot(P,Nivel1),
	explica_porque_nao(LPF,Nivel).

formata(Nivel):-
	Esp is (Nivel-1)*5, tab(Esp).