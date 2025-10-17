%%%%%%%%%%%%%%%%%%%%%
% Mostrar factos    %  
%%%%%%%%%%%%%%%%%%%%%

mostra_factos:-
	findall(N, facto(N, _), LFactos),
	escreve_factos(LFactos).

mostra_factos_json(JSON) :-
    findall(KeyStr-FactJson, (
        facto(N, Fact),
        atom_number(KeyStr, N),
        Fact =.. [Field, Arg1, Arg2],
        (atom(Arg1) -> atom_string(Arg1, Arg1String) ; Arg1String = Arg1),
        FactJson = json([Field=[Arg1String, Arg2]])
    ), Pairs),
    JSON = json(Pairs).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Predicados para retirar factos %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

retirar_facto(K) :-
	retract(facto(K,_)),
	findall(K1,(justifica(K1,_,L),member(K,L)),LK1),retirar_lista_factos(LK1).
    
retirar_lista_factos([ ]).
	retirar_lista_factos([K1|LK1]):-
	retract(justifica(K1,_,_)),
	retirar_facto(K1),
	retirar_lista_factos(LK1).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Calculo de certeza de via aérea difícil %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

calcular_cf(CFFinal) :-
    findall(Value,
        (facto(_, Facto),
         Facto =.. [fator, _Category, Args],
         Args = [_, Value]),
        CFs),
    calcular_cf1(CFs, 0, CF),
    CFFinal is CF * 2 - 1.

calcular_cf1([], CF, CF) :- !.
calcular_cf1([CF1 | Rest], CF2, CF) :-
    combine_cf(CF2, CF1, CF3),
    calcular_cf1(Rest, CF3, CF).

combine_cf(CF1, CF2, CF) :-
    CF1 >= 0, CF2 >= 0,
    CF is CF1 + CF2 * (1 - CF1), !.

%combine_cf(CF1, CF2, CF) :-
%    CF1 < 0, CF2 < 0,
%    CF is CF1 + CF2 * (1 + CF1), !.

%combine_cf(CF1, CF2, CF) :-
%    CF is (CF1 + CF2) / (1 - min(abs(CF1), abs(CF2))), !.