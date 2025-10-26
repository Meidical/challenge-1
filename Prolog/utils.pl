%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Mostrar factos    %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Mostra todos os factos de um paciente (consola)
mostra_factos(PatientID) :-
    findall(N, facto(PatientID, N, _), LFactos),
    escreve_factos(PatientID, LFactos).

% Mostra todos os factos de um paciente (JSON)
mostra_factos_json(PatientID, JSON) :-
    findall(_{
        n: N,
        fact: FText,
        patient: PatientID
    }, (
        facto(PatientID, N, F),
        term_to_atom(F, FText)   % <-- convert idade(20) → "idade(20)"
    ), JSON).



% Mostra todos os factos
mostra_factos_json(JSON) :-
    findall(
        _{patient:PID, n:N, fact:FactString},
        (facto(PID, N, F),term_string(F, FactString)), JSON
    ).


%%%%%%%%%%%%%%%%%%%%%
% Escrever factos   %
%%%%%%%%%%%%%%%%%%%%%

escreve_factos(PatientID, [I|R]) :-
    facto(PatientID, I, F), !,
    format('O facto nº ~w -> ~w é verdadeiro~n', [I, F]),
    escreve_factos(PatientID, R).
escreve_factos(PatientID, [_|R]) :-
    escreve_factos(PatientID, R).
escreve_factos(_, []).

%%%%%%%%%%%%%%%%%%%%%%%%%%
% Retirar factos         %
%%%%%%%%%%%%%%%%%%%%%%%%%%

retirar_facto(PatientID, K) :-
    retract(facto(PatientID, K, _)),
    findall(K1, (justifica(PatientID, K1, _, L), member(K, L)), LK1),
    retirar_lista_factos(PatientID, LK1).

retirar_lista_factos(PatientID, [K1 | LK1]) :-
    retract(justifica(PatientID, K1, _, _)),
    retirar_facto(PatientID, K1),
    retirar_lista_factos(PatientID, LK1).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Calculo de certeza de via aérea difícil
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

calcular_cf(PatientID, Category, CF) :-
    findall(Value,
        (facto(PatientID, _, fator(Category, Args)),
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

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Obter procedimento recomendado atual
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

ultimo_rec_processo(PatientID, Valor) :-
    findall(N, facto(PatientID, N, rec_processo(_)), Lista),
    Lista \= [],                            
    max_list(Lista, UltimoID),
    facto(PatientID, UltimoID, rec_processo(Valor)).

ultimo_rec_processo(PatientID, "Nenhum processo encontrado") :-
    \+ facto(PatientID, _, rec_processo(_)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Responder com JSON do processo
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

reply_processo_json(PatientID) :-
    ultimo_rec_processo(PatientID, ValorRec),
    (   facto(PatientID, _, conclusion(true))
    ->  reply_json(_{rec_processo: ValorRec, conclusion: true})
    ;   reply_json(_{rec_processo: ValorRec, conclusion: false})
    ).
