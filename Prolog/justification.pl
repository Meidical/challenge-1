%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Geração de explicações do tipo "Como"

como(PatientID, N):-contar_factos(PatientID, Last),Last<N,!,
	write('Essa conclusão não foi tirada'),nl,nl.
como(PatientID, N):-justifica(PatientID, N, ID, LFactos),!,
	facto(PatientID,N,F),
	write('Conclui o facto nº '),write(N),write(' -> '),write(F),nl,
	write('pela regra '),write(ID),nl,
	write('por se ter verificado que:'),nl,
	escreve_factos(PatientID, LFactos),
	write(''),nl,
	explica(PatientID, LFactos).
como(PatientID, N):-facto(PatientID, N, F),
	write('O facto nº '),write(N),write(' -> '),write(F),nl,
	write('foi conhecido inicialmente'),nl,
	write(''),nl.

explica(PatientID, [I|R]):- \+ integer(I),!,explica(PatientID, R).
explica(PatientID, [I|R]):-como(PatientID, I),
		explica(PatientID, R).
explica(_, []):-	write(''),nl.


% Como JSON
como_json(PatientID, N, json([error="Conclusion not reached"])) :-
    contar_factos(PatientID, Last), 
    Last < N, !.

como_json(PatientID, N, JSON) :-
    justifica(PatientID, N, ID, LFactos), !,
    facto(PatientID, N, F),
    F =.. [Predicate|Args],
    
    % Get supporting facts - FIXED to collect all facts
    findall(json([
        id=FactID,
        predicate=Pred,
		patientId=PatientID1, 
        arguments=Args2,
        type=Type
    ]), (
        member(FactID, LFactos),
        integer(FactID),          
        facto(PatientID1, FactID, Fact),      % Get the actual fact
        Fact =.. [Pred|Args2],    % Extract predicate and arguments
        (justifica(PatientID1, FactID, _, _) -> Type = "derived_fact" ; Type = "initial_fact")
    ), SupportingFacts),
    
    % Get rule description if available
    (regra ID descricao Desc se LHS entao _RHS ->
        term_string(LHS, LHSString)
    ;
		LHSString = "",
        Desc = "No description"
    ),

    JSON = json([
        conclusion=json([
            id=N,
            predicate=Predicate,
            arguments=Args
        ]),
        rule=json([
            id=ID,
            description=Desc,
			lhs=LHSString
        ]),
        supporting_facts=SupportingFacts
    ]).

como_json(PatientID, N, JSON) :-
    facto(PatientID, N, F),
    F =.. [Predicate|Args],
    JSON = json([
        conclusion=json([
            id=N,
            predicate=Predicate,
            arguments=Args
        ]),
        type="initial_fact"
    ]).


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