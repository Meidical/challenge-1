:- set_prolog_flag(encoding, utf8).

%% Servidor
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_parameters)).

% Make sure to include the necessary JSON libraries
:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).

% Module list
:- use_module(library(lists)).

% Versão preparada para lidar com regras que contenham negação (nao)
% Metaconhecimento
% Usar base de conhecimento veIculos2.txt
% Explicações como?(how?) e porque não?(whynot?)

:-op(220,xfx,entao).
:-op(35,xfy,se).
:-op(240,fx,regra).
:-op(500,fy,nao).
:-op(600,xfy,e).

:-dynamic justifica/3.

ultimo:-
    findall(N, facto(N, _), Ns),
    reverse(Ns, [Last|_]),
    retractall(ultimo_facto(_)),
    assertz(ultimo_facto(Last)).

arranca_motor1:-
	findall(_,arranca_motor,_).

arranca_motor:-	facto(N,Facto),
		facto_dispara_regras1(Facto, LRegras),
		dispara_regras(N, Facto, LRegras),
		ultimo.

facto_dispara_regras1(Facto, LRegras):-
	facto_dispara_regras(Facto, LRegras),
	!.
facto_dispara_regras1(_, []).
% Caso em que o facto não origina o disparo de qualquer regra.

dispara_regras(N, Facto, [ID|LRegras]):-
	regra ID se LHS entao RHS,
	facto_esta_numa_condicao(Facto,LHS),
	% Instancia Facto em LHS
	verifica_condicoes(LHS, LFactos),
	member(N,LFactos),
	concluir(RHS,ID,LFactos),
	!,
	dispara_regras(N, Facto, LRegras).

dispara_regras(N, Facto, [_|LRegras]):-
	dispara_regras(N, Facto, LRegras).

dispara_regras(_, _, []).


facto_esta_numa_condicao(F,[F  e _]).

facto_esta_numa_condicao(F,[avalia(F1)  e _]):- F=..[H,H1|_],F1=..[H,H1|_].

facto_esta_numa_condicao(F,[_ e Fs]):- facto_esta_numa_condicao(F,[Fs]).

facto_esta_numa_condicao(F,[F]).

facto_esta_numa_condicao(F,[avalia(F1)]):-F=..[H,H1|_],F1=..[H,H1|_].


verifica_condicoes([nao avalia(X) e Y],[nao X|LF]):- !,
	\+ avalia(_,X),
	verifica_condicoes([Y],LF).
verifica_condicoes([avalia(X) e Y],[N|LF]):- !,
	avalia(N,X),
	verifica_condicoes([Y],LF).

verifica_condicoes([nao avalia(X)],[nao X]):- !, \+ avalia(_,X).
verifica_condicoes([avalia(X)],[N]):- !, avalia(N,X).

verifica_condicoes([nao X e Y],[nao X|LF]):- !,
	\+ facto(_,X),
	verifica_condicoes([Y],LF).
verifica_condicoes([X e Y],[N|LF]):- !,
	facto(N,X),
	verifica_condicoes([Y],LF).

verifica_condicoes([nao X],[nao X]):- !, \+ facto(_,X).
verifica_condicoes([X],[N]):- facto(N,X).



concluir([cria_facto(F)|Y],ID,LFactos):-
	!,
	cria_facto(F,ID,LFactos),
	concluir(Y,ID,LFactos).

concluir([],_,_):-!.



cria_facto(F,_,_):-
	facto(_,F),!.

cria_facto(F,ID,LFactos):-
    retract(ultimo_facto(N1)),
    N is N1+1,
    asserta(ultimo_facto(N)),
    assertz(justifica(N,ID,LFactos)),
    assertz(facto(N,F)),!.
    %format('Foi concluído o facto nº ~w -> ~w~n', [N, F]),!.



avalia(N,P):-	P=..[Functor,Entidade,Operando,Valor],
		P1=..[Functor,Entidade,Valor1],
		facto(N,P1),
		compara(Valor1,Operando,Valor).

compara(V1,==,V):- V1==V.
compara(V1,\==,V):- V1\==V.
compara(V1,>,V):-V1>V.
compara(V1,<,V):-V1<V.
compara(V1,>=,V):-V1>=V.
compara(V1,=<,V):-V1=<V.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Visualização da base de factos

mostra_factos:-
	findall(N, facto(N, _), LFactos),
	escreve_factos(LFactos).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Geração de explicações do tipo "Como"

como(N):-ultimo_facto(Last),Last<N,!,
	write('Essa conclusão não foi tirada'),nl,nl.
como(N):-justifica(N,ID,LFactos),!,
	facto(N,F),
	write('Conclui o facto nº '),write(N),write(' -> '),write(F),nl,
	write('pela regra '),write(ID),nl,
	write('por se ter verificado que:'),nl,
	escreve_factos(LFactos),
	write('********************************************************'),nl,
	explica(LFactos).
como(N):-facto(N,F),
	write('O facto nº '),write(N),write(' -> '),write(F),nl,
	write('foi conhecido inicialmente'),nl,
	write('********************************************************'),nl.


escreve_factos([I|R]):-facto(I,F), !,
	write('O facto nº '),write(I),write(' -> '),write(F),write(' é verdadeiro'),nl,
	escreve_factos(R).
escreve_factos([I|R]):-
	write('A condição '),write(I),write(' é verdadeira'),nl,
	escreve_factos(R).
escreve_factos([]).

explica([I|R]):- \+ integer(I),!,explica(R).
explica([I|R]):-como(I),
		explica(R).
explica([]):-	write('********************************************************'),nl.




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Geração de explicações do tipo "Porque nao"
% Exemplo: ?- whynot(classe(meu_veículo,ligeiro)).

whynot(Facto):-
	whynot(Facto,1).

whynot(Facto,_):-
	facto(_, Facto),
	!,
	write('O facto '),write(Facto),write(' não é falso!'),nl.
whynot(Facto,Nivel):-
	encontra_regras_whynot(Facto,LLPF),
	whynot1(LLPF,Nivel).
whynot(nao Facto,Nivel):-
	formata(Nivel),write('Porque:'),write(' O facto '),write(Facto),
	write(' é verdadeiro'),nl.
whynot(Facto,Nivel):-
	formata(Nivel),write('Porque:'),write(' O facto '),write(Facto),
	write(' não está definido na base de conhecimento'),nl.

%  As explicações do whynot(Facto) devem considerar todas as regras que poderiam dar origem a conclusão relativa ao facto Facto

encontra_regras_whynot(Facto,LLPF):-
	findall((ID,LPF),
		(
		regra ID se LHS entao RHS,
		member(cria_facto(Facto),RHS),
		encontra_premissas_falsas(LHS,LPF),
		LPF \== []
		),
		LLPF).

whynot1([],_).
whynot1([(ID,LPF)|LLPF],Nivel):-
	formata(Nivel),write('Porque pela regra '),write(ID),write(':'),nl,
	Nivel1 is Nivel+1,
	explica_porque_nao(LPF,Nivel1),
	whynot1(LLPF,Nivel).

encontra_premissas_falsas([nao X e Y], LPF):-
	verifica_condicoes([nao X], _),
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([X e Y], LPF):-
	verifica_condicoes([X], _),
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([nao X], []):-
	verifica_condicoes([nao X], _),
	!.
encontra_premissas_falsas([X], []):-
	verifica_condicoes([X], _),
	!.
encontra_premissas_falsas([nao X e Y], [nao X|LPF]):-
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([X e Y], [X|LPF]):-
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([nao X], [nao X]):-!.
encontra_premissas_falsas([X], [X]).
encontra_premissas_falsas([]).

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
	Esp is (Nivel-1)*5, tab(Esp).

servidor(Port) :-
    http_server(http_dispatch, [port(Port)]).

mostra_factos_json(JSON) :-
    findall(KeyStr-FactJson, (
        facto(N, Fact),
        atom_number(KeyStr, N),
        Fact =.. [Field, Arg1, Arg2],
        (atom(Arg1) -> atom_string(Arg1, Arg1String) ; Arg1String = Arg1),
        FactJson = json([Field=[Arg1String, Arg2]])
    ), Pairs),
    JSON = json(Pairs).

% HTTP handler for getting facts as JSON
:- http_handler(root(show), get_facts_json, []).

get_facts_json(_Request) :-
    mostra_factos_json(JSON),
    reply_json(JSON).

:- http_handler(root(facts), load_facts_json, [method(post)]).

load_facts_json(Request) :-
   retractall(facto(_,_)),
   http_read_json(Request, DictIn,[json_object(term)]),
   DictOut=DictIn,
   reply_json(DictOut),
   assert_json_facts(DictIn).

assert_json_facts(json(Pairs)) :-
    maplist(assert_json_fact, Pairs).

assert_json_fact(Key=json([Field=[Arg1,Arg2]])) :-
    atom_number(Key, Num),
    facto_functor(Field, Arg1, Arg2, Fact),
    assertz(facto(Num, Fact)).

facto_functor(Field, V, N, Term) :-
    atom_string(V2, V),
    Term =.. [Field, V2, N].

% Convert "como" explanation to JSON format
como_json(N, json([error="Conclusion not reached"])) :-
    ultimo_facto(Last), 
    Last < N, !.

como_json(N, JSON) :-
    justifica(N, ID, LFactos), !,
    facto(N, F),
    F =.. [Predicate|Args],
    
    % Get supporting facts - FIXED to collect all facts
    findall(json([
        id=FactID,
        predicate=Pred,
        arguments=Args2,
        type=Type
    ]), (
        member(FactID, LFactos),
        integer(FactID),          
        facto(FactID, Fact),      % Get the actual fact
        Fact =.. [Pred|Args2],    % Extract predicate and arguments
        (justifica(FactID, _, _) -> Type = "derived_fact" ; Type = "initial_fact")
    ), SupportingFacts),
    
    % Get rule description if available
    (regra ID se LHS entao _RHS ->
        term_string(LHS, LHSString)
    ;
        LHSString = ""
    ),
    
    JSON = json([
        conclusion=json([
            id=N,
            predicate=Predicate,
            arguments=Args
        ]),
        rule=json([
            id=ID,
            description=LHSString
        ]),
        supporting_facts=SupportingFacts
    ]).

como_json(N, JSON) :-
    facto(N, F),
    F =.. [Predicate|Args],
    JSON = json([
        conclusion=json([
            id=N,
            predicate=Predicate,
            arguments=Args
        ]),
        type="initial_fact"
    ]).

% HTTP handler for getting explanations as JSON using query parameter
:- http_handler(root(explain), get_explanation_json, []).

get_explanation_json(Request) :-
    http_parameters(Request, [id(ID, [integer])]),
    como_json(ID, JSON),
    reply_json(JSON).

:- http_handler(root(start), start_engine, []).

start_engine(_Request) :-
    % Store current facts before running engine
    findall(N, facto(N, _), ExistingFactIDs),
    
    % Run the engine
    arranca_motor1,
    
    % Get all facts after running
    findall(N, facto(N, _), AllFactIDs),
    
    % Find only new fact IDs (set difference)
    subtract(AllFactIDs, ExistingFactIDs, NewFactIDs),
    
    % Build the JSON object with the correct format
    findall(KeyStr-FactJson, (
        member(N, NewFactIDs),
        facto(N, Fact),
        atom_number(KeyStr, N),  % Convert N to string for JSON key
        Fact =.. [Field, Arg1, Arg2],
        (atom(Arg1) -> atom_string(Arg1, Arg1String) ; Arg1String = Arg1),
        FactJson = json([Field=[Arg1String, Arg2]])
    ), Pairs),
    
    % Create the final JSON response
    FactsJSON = json(Pairs),
    
    % Return as JSON
    reply_json(json([
        status='Engine started successfully',
        new_facts=FactsJSON
    ])).