:-op(220,xfx,entao).
:-op(35,xfy,se).
:-op(240,fx,regra).
:-op(500,fy,nao).
:-op(600,xfy,e).

:-dynamic justifica/3.

arranca_motor:-
	findall(_,arranca_motor1,_).

arranca_motor1:-
    facto(N,Facto),
    contar_factos(Cont),
    assertz(ultimo_facto(Cont)),
    facto_dispara_regras1(Facto, LRegras),
    dispara_regras(N, Facto, LRegras),
    retractall(ultimo_facto(_)).

contar_factos(Cont):-
    findall(X, facto(X, _), Lista),
    length(Lista, Cont).

prox_facto(N) :-
    contar_factos(Cont),
    N is Cont + 1.

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
    assertz(facto(N,F)).
    %format('Foi concluído o facto nº ~w -> ~w~n', [N, F]),!.


avalia(N,P):-
    P=..[Functor,Entidade,Operando,Valor],
    P1=..[Functor,Entidade,Valor1],
    facto(N,P1),
    compara(Valor1,Operando,Valor).

compara(V1,==,V):- V1==V.
compara(V1,\==,V):- V1\==V.
compara(V1,>,V):-V1>V.
compara(V1,<,V):-V1<V.
compara(V1,>=,V):-V1>=V.
compara(V1,=<,V):-V1=<V.



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Inferir probabilidade de via aérea difícil %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

inferir_via_aerea(Dict) :-         
    retractall(facto(_,_)),                      
    retractall(ultimo_facto(_)),

    assertz(facto(1, id_paciente(Dict.patientId))),
    assertz(facto(2, idade(Dict.age))),
    assertz(facto(3, bmi(Dict.bmi))),
    assertz(facto(4, mnemonica("LEMON", 0.5))),
    assertz(facto(5, mnemonica("MOANS", 0.2))),
    assertz(facto(6, mnemonica("RODS", 0.2))),
    assertz(facto(7, mnemonica("SHORT", 0.1))),

    asserta(ultimo_facto(7)), 

    assert_lista_fatores(Dict.lemonFactors),
    assert_lista_fatores(Dict.moansFactors),
    assert_lista_fatores(Dict.rodsFactors),
    assert_lista_fatores(Dict.shortFactors),

    arranca_motor,

    forall(
        facto(_, mnemonica(Nome, Peso)),
        (
            calcular_cf(Nome, CF),
            CF1 is CF * Peso,
            prox_facto(N),
            assertz(facto(N, mnemonica_cf(Nome, CF1)))
        )
    ),

    arranca_motor.


assert_lista_fatores(null) :- !. 
assert_lista_fatores([]) :- !.        
assert_lista_fatores([H | Lista]) :-
    (H.present == true, assert_fator(H.category, H.code);   
    H.present \== true),
    assert_lista_fatores(Lista).       


assert_fator(Category, Code) :-
    (retract(ultimo_facto(N1)) -> true ; N1 = 0),
    N is N1 + 1,
    asserta(ultimo_facto(N)),
    assertz(facto(N, fator(Category, Code))).


%%%%%%%%%%%%%%%%%%%%
% Via aérea normal %
%%%%%%%%%%%%%%%%%%%%

laringoscopia(Dict) :-
    prox_facto(N),
    assertz(facto(N, processo("LD", Dict.successful))),
    arranca_motor.

mascara_facial(Dict) :-
    prox_facto(N),
    assertz(facto(N, processo("MF", Dict.successful))),
    arranca_motor.