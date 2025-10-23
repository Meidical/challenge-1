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
        Fact =.. [Name | Args],           
        FactJson = json([Name = Args])   
    ), Pairs),
    JSON = json(Pairs).

%%%%%%%%%%%%%%%%%%%%%
% Escrever factos   %  
%%%%%%%%%%%%%%%%%%%%%
escreve_factos([I|R]):-facto(I,F), !,
	write('O facto nº '),write(I),write(' -> '),write(F),write(' é verdadeiro'),nl,
	escreve_factos(R).
escreve_factos([I|R]):-
	write('A condição '),write(I),write(' é verdadeira'),nl,
	escreve_factos(R).
escreve_factos([]).

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

calcular_cf(Category, CF) :-
    findall(Value,
        (facto(_, Facto),
         Facto =.. [fator, Category, Args],
         Args = [_, Value]),
        CFs),
    calcular_cf1(CFs, 0, CF).

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

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Obter procedimento recomendado atual %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

ultimo_rec_processo(Valor) :-
    findall(N, facto(N, rec_processo(_)), Lista),
    max_list(Lista, UltimoID),
    facto(UltimoID, rec_processo(Valor)).

reply_processo_json :-
    ultimo_rec_processo(ValorRec),
    (
        facto(_, final(true)),
        reply_json(_{rec_processo: ValorRec, final: true});
        reply_json(_{rec_processo: ValorRec, final: false})
    ).
    