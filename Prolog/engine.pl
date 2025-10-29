:- op(220, xfx, entao).
:- op(35, xfy, se).
:- op(240, fx, regra).
:- op(500, fy, nao).
:- op(600, xfy, e).
:- op(36, xfy, descricao).

:- dynamic facto/3.
:- dynamic justifica/4.
:- dynamic ultimo_facto/2.


% mnemonica(Nome, Peso)
mnemonica("LEMON", 0.5).
mnemonica("MOANS", 0.2).
mnemonica("RODS", 0.2).
mnemonica("SHORT", 0.1).


%%%%%%%%%%%%%%%%%%%%%%%%
% Motor de inferência  %
%%%%%%%%%%%%%%%%%%%%%%%%

arranca_motor(PatientID) :-
    forall(
        facto(PatientID, N, Facto),
        arranca_motor1(PatientID, N, Facto)
    ).

arranca_motor1(PatientID, N, Facto) :-
    ultimo_facto(PatientID, Cont),
    retractall(ultimo_facto(PatientID, _)),
    assertz(ultimo_facto(PatientID, Cont)),
    facto_dispara_regras1(PatientID, Facto, LRegras),
    dispara_regras(PatientID, N, Facto, LRegras).

prox_facto(PatientID, N) :-
    ultimo_facto(PatientID, N),
    retractall(ultimo_facto(_,_)),
    N1 is N + 1,
    assertz(ultimo_facto(PatientID, N1)).

facto_dispara_regras1(_, Facto, LRegras) :-
    facto_dispara_regras(Facto, LRegras),
    !.
facto_dispara_regras1(_, _, []).

dispara_regras(PatientID, N, Facto, [ID|LRegras]) :-
    regra ID se LHS entao RHS,
    facto_esta_numa_condicao(Facto, LHS),
    verifica_condicoes(PatientID, LHS, LFactos),
    member(N, LFactos),
    concluir(PatientID, RHS, ID, LFactos),
    !,
    dispara_regras(PatientID, N, Facto, LRegras).

dispara_regras(PatientID, N, Facto, [_|LRegras]) :-
    dispara_regras(PatientID, N, Facto, LRegras).
dispara_regras(_, _, _, []).


facto_esta_numa_condicao(F,[F e _]).
facto_esta_numa_condicao(F, [avalia(F1) e _]) :-
    F =.. [Functor, Arg1 | _],
    F1 =.. [Functor, Arg1 | _].
facto_esta_numa_condicao(F,[_ e Fs]) :-
    facto_esta_numa_condicao(F,[Fs]).
facto_esta_numa_condicao(F,[F]).
facto_esta_numa_condicao(F, [avalia(F1)]) :-
    F =.. [Functor, Arg1 | _],
    F1 =.. [Functor, Arg1 | _].

verifica_condicoes(PatientID, [nao avalia(X) e Y],[nao X|LF]) :- !,
    \+ avalia(PatientID, _, X),
    verifica_condicoes(PatientID, [Y], LF).
verifica_condicoes(PatientID, [avalia(X) e Y],[N|LF]) :- !,
    avalia(PatientID, N, X),
    verifica_condicoes(PatientID, [Y], LF).

verifica_condicoes(PatientID, [nao avalia(X)],[nao X]) :- !,
    \+ avalia(PatientID, _, X).
verifica_condicoes(PatientID, [avalia(X)],[N]) :- !,
    avalia(PatientID, N, X).

verifica_condicoes(PatientID, [nao X e Y],[nao X|LF]) :- !,
    \+ facto(PatientID, _, X),
    verifica_condicoes(PatientID, [Y], LF).
verifica_condicoes(PatientID, [X e Y],[N|LF]) :- !,
    facto(PatientID, N, X),
    verifica_condicoes(PatientID, [Y], LF).

verifica_condicoes(PatientID, [nao X],[nao X]) :- !,
    \+ facto(PatientID, _, X).
verifica_condicoes(PatientID, [X],[N]) :-
    facto(PatientID, N, X).


concluir(PatientID, [cria_facto(F)|Y], ID, LFactos) :- !,
    cria_facto(PatientID, F, ID, LFactos),
    concluir(PatientID, Y, ID, LFactos).
concluir(_, [], _, _) :- !.

cria_facto(PatientID, F, _, _) :-
    facto(PatientID, _, F), !.
cria_facto(PatientID, F, ID, LFactos) :-
    prox_facto(PatientID, N),
    assertz(justifica(PatientID, N, ID, LFactos)),
    assertz(facto(PatientID, N, F)).


avalia(PatientID, N, P) :-
    P =.. [Functor, Entidade, Operador, Valor],
    P1 =.. [Functor, Entidade, Valor1],
    facto(PatientID, N, P1),
    
    compara(Valor1, Operador, Valor), !.


compara(V1, ==, V)  :- V1 == V.
compara(V1, \==, V) :- V1 \== V.
compara(V1, >, V)   :- V1 > V.
compara(V1, <, V)   :- V1 < V.
compara(V1, >=, V)  :- V1 >= V.
compara(V1, =<, V)  :- V1 =< V.

%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Avaliação de via aérea  %
%%%%%%%%%%%%%%%%%%%%%%%%%%%

inferir_via_aerea(Dict) :-
    get_dict(patientId, Dict, PatientID),

    % Remove dados do paciente caso seja o mesmo
    retractall(facto(PatientID, _, _)),
    retractall(ultimo_facto(PatientID, _)),
    retractall(justifica(PatientID,_,_,_)),


    assertz(facto(PatientID, 1, idade(Dict.age))),
    assertz(facto(PatientID, 2, bmi(Dict.bmi))),
    assertz(ultimo_facto(PatientID, 3)),

    assert_lista_fatores(PatientID, Dict.lemonFactors),
    assert_lista_fatores(PatientID, Dict.moansFactors),
    assert_lista_fatores(PatientID, Dict.rodsFactors),
    assert_lista_fatores(PatientID, Dict.shortFactors),

    arranca_motor(PatientID), % Inferir tipo de via aérea

    % Calcular CFs individuais
    forall(
        mnemonica(Nome, _),
        (   
            calcular_cf(PatientID, Nome, CF),
            prox_facto(PatientID, N),
            assertz(facto(PatientID, N, mnemonica_cf(Nome, CF)))
        )
    ),

    % Calcular total de CFs
    findall([Nome,CF], facto(PatientID, _, mnemonica_cf(Nome, CF)), CFs),
    calcular_total_cf(CFs, Total),
    prox_facto(PatientID, N2),
    assertz(facto(PatientID, N2, mnemonica_cf("Total", Total))),

    arranca_motor(PatientID).

assert_lista_fatores(_, null) :- !.
assert_lista_fatores(_, []) :- !.
assert_lista_fatores(PatientID, [H|T]) :-
    (H.present == true ->
        assert_fator(PatientID, H.category, H.code)
    ; true),
    assert_lista_fatores(PatientID, T).

assert_fator(PatientID, Category, Code) :-
    prox_facto(PatientID, N),
    assertz(facto(PatientID, N, fator(Category, Code))).

%%%%%%%%%%%%%%%%%%%%
% Processos 
%%%%%%%%%%%%%%%%%%%%

get_prox_processo(PatientID, ID, Dict) :-
    prox_facto(PatientID, N),
    assertz(facto(PatientID, N, facto_pedido(ID, Dict.successful))),

    arranca_motor(PatientID),
    arranca_motor(PatientID),

    retractall(facto(PatientID, _, facto_pedido(_, _))).