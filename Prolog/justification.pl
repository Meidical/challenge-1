%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Geração de explicações do tipo "Como"

como_json(PatientID, _, TextStr) :-

    % Obter via aérea
    facto(PatientID, _, via_aerea_dificil(Status)),

    % Obter última recomendação
    findall(Val, facto(PatientID, _, rec_processo(_, Val)), Recs),
    last(Recs, Rec),

    % Obter mnemonicas
    findall(Nome-CF, facto(PatientID, _, mnemonica_cf(Nome, CF)), CFs),

    findall(ID-Fact,
        (facto(PatientID, ID, F), functor(F, processo, _), Fact = F),
        Factos),

    with_output_to(atom(TextAtom),
      ( format('Patient ~w summary:~n', [PatientID]),
        (Status == true  -> format('\tDifficult airway predicted: true~n',  []);
         Status == false -> format('\tDifficult airway predicted: false~n', []);
         true),
        format('\tRecommended approach: ~w~n', [Rec]),
        format('\tMnemonics:~n', []),
        forall(member(Nome-CF, CFs),
            (
                format('\t  ~w = ~2f~n', [Nome, CF]), 
                mostra_fatores(PatientID, Nome)
            )),
        nl,
        format('Workflow for patient ~w:~n', [PatientID]),
        como(Factos, 1),
        (   facto(PatientID, _, conclusion(true))
            ->  format('~nConclusion = ~w~n', [Rec])
            ;   true
        )
      )),
    atom_string(TextAtom, TextStr).


como([], _).
como([_-Fact | Rest], Index) :-
    Fact =.. [Pred | Args],
    (   Pred == processo,
        Args = [Nome, Status]
    ->  format('[~d] ~w = ~w~n', [Index, Nome, Status])
    ;   junta_argumentos(Args, ArgsStr),
        format('[~d] ~w = ~w~n', [Index, Pred, ArgsStr])
    ),
    Next is Index + 1,
    como(Rest, Next).


mostra_fatores(PatientID, Mnemonica0) :-
    term_to_atom(Mnemonica0, Mn),
    findall(Let-Val,
        (   facto(PatientID, _, fator(MnX, [Let, Val])),
            term_to_atom(MnX, Mn)
        ),
        Pairs),
    forall(member(Let-Val, Pairs),
        format('\t\t~w -> ~w~n', [Let, Val])
    ).



junta_argumentos(Args, TextOut) :-
    maplist(arg_para_texto, Args, AtomList),
    atomic_list_concat(AtomList, ' = ', TextOut).

arg_para_texto(Arg, Text) :-
    ( is_list(Arg)
    -> maplist(term_to_atom, Arg, Inner),
       atomic_list_concat(Inner, ', ', InnerTxt),
       format(atom(Text), '[~w]', [InnerTxt])
    ;  term_to_atom(Arg, Text)
    ).


get_root_id(PatientID, RootID) :-
    findall(ID, facto(PatientID, ID, rec_processo(_, _)), R1),
    findall(ID, facto(PatientID, ID, processo(_, _)),     R2),
    findall(ID, facto(PatientID, ID, conclusao(_)),       R3),
    append(R1, R2, R12),
    append(R12, R3, All),
    All \= [], !,
    last(All, RootID).

get_root_id(PatientID, RootID) :-
    once(facto(PatientID, RootID, via_aerea_dificil(_))).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Geração de explicações do tipo "Porque nao"
% Exemplo: ?- whynot(classe(meu_veículo,ligeiro)).

whynot_json(PatientID, Facto, JSON) :-
    with_output_to(atom(TextAtom),
        (   (   whynot(PatientID, Facto)
            ->  true
            ;   true
            )
        )
    ),
    atom_string(TextAtom, TextStr),
    JSON = json([justification=TextStr]).


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