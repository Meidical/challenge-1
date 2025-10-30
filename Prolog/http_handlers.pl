% HTTP GET para obter factos do paciente
:- http_handler(root(api/PatientIDA/facts), get_facts_json(PatientIDA), []).
get_facts_json(PatientIDA, _Request) :-

    atom_string(PatientIDA, PatientID),

    mostra_factos_json(PatientID, JSON),
    reply_json(JSON).





% HTTP GET para obter todos os factos
:- http_handler(root(api/facts), get_facts_json, []).
get_facts_json(_Request) :-
    mostra_factos_json(JSON),
    reply_json(JSON).





% HTTP POST para inferir probabilidade de via aérea difícil
:- http_handler(root(api/assessment), post_inferir_via_aerea, [method(post)]).
post_inferir_via_aerea(Request) :-
    http_read_json_dict(Request, Dict),
    inferir_via_aerea(Dict),
    PatientID = Dict.patientId,
    build_inferir_via_aerea_json(PatientID, JSONFinal),
    reply_json(json(JSONFinal)).

build_inferir_via_aerea_json(PatientID, JSONFinal) :-

    % Encontrar CFs para cada mnemónica
    findall(Key=CF,
    (   facto(PatientID, _, mnemonica_cf(Name, CF)),
        downcase_atom(Name, LowerName),
        atomic_list_concat([LowerName, 'Cf'], '', Key)
    ),
    JSON1),

    (   facto(PatientID, _, via_aerea_dificil(true)),
        append(JSON1, [difficultAirwayPredicted=true], JSON2)
    ;   append(JSON1, [difficultAirwayPredicted=false], JSON2)
    ),
 
    % Encontrar processo recomendado
    facto(PatientID, _, id_prox_facto(N)),
    ultimo_rec_processo(PatientID, N, ValorRec),
    append(JSON2, [recommendedApproach=ValorRec], JSON3),

    % Encontrar id do próximo processo
    facto(PatientID, _, id_prox_facto(NFacto)),
    append(JSON3, [nextFactId=NFacto], JSON4),

    % Justificar resultados da mnemónica
    build_justificacao_mnemonicas(PatientID, MnemonicsText),
    append(JSON4, [justification=MnemonicsText], JSONFinal),

    retractall(facto(PatientID, _, id_prox_facto(_))).


build_justificacao_mnemonicas(PatientID, FullText) :-
    findall(N, facto(PatientID, N, mnemonica_cf(_, _)), Ns),
    juntar_texto_mnemonicas(PatientID, Ns, "", FullText).

juntar_texto_mnemonicas(_, [], Acc, Acc).
juntar_texto_mnemonicas(PatientID, [N | Rest], Acc, FullText) :-
    (   facto(PatientID, N, mnemonica_cf(Name, _)),
        como_json(PatientID, N, Text)
    ->  format(string(Header), "\n\n=== Explanation for ~w ===\n", [Name]),
        string_concat(Acc, Header, Acc1),
        string_concat(Acc1, Text, Acc2)
    ;   Acc2 = Acc
    ),
    juntar_texto_mnemonicas(PatientID, Rest, Acc2, FullText).



% HTTP GET para explicações "como"
:- http_handler(root(api/explain), get_explanation_json, []).
get_explanation_json(Request) :-
    http_parameters(Request, [
        id(ID, [integer]),
        patientId(PatientID, [string])
    ]),
    como_json(PatientID, ID, JSON),
    reply_json(json([justification=JSON])).





% HTTP POST para processos médicos
:- http_handler(root(api/assessment/PatientIDA/facts/IDA), post_prox_processo(PatientIDA, IDA), [method(post)]).
post_prox_processo(PatientIDA, IDA, Request) :-

    atom_string(PatientIDA, PatientID),
    atom_string(IDA, ID),

    http_read_json_dict(Request, Dict),
    get_prox_processo(PatientID, ID, Dict),
    reply_processo_json(PatientID),
    
    retractall(facto(PatientID, _, id_prox_facto(_))).

reply_processo_json(PatientID) :-
    facto(PatientID, _, id_prox_facto(N)),
    ultimo_rec_processo(PatientID, N, Rec),
    (   facto(PatientID, N1, conclusao(true)),
        reply_json(_{
            nextFactDescription: Rec, 
            conclusion: true,
            justification_id: N1
        })
    ;   reply_json(_{
            nextFactDescription: Rec, 
            conclusion: false, 
            nextFactId: N
        })
    ).

ultimo_rec_processo(PatientID, N, Valor) :-
    facto(PatientID, _, rec_processo(N, Valor)).

ultimo_rec_processo(PatientID, _, "Nenhum processo encontrado") :-
    \+ facto(PatientID, _, rec_processo(_)).



%  HTTP DELETE para retirar todos os factos de um paciente
:- http_handler(root(api/remove), delete_retirar_paciente, [method(delete)]).
delete_retirar_paciente(Request) :-
    http_parameters(Request, [
        patientID(PatientID, [string])
    ]),
    retractall(facto(PatientID, _, _)),
    reply_json(_{status:"Patient removed successfully"}).

%  HTTP DELETE para retirar todos os factos
:- http_handler(root(api/removeAll), delete_retirar_factos, [method(delete)]).
delete_retirar_factos(_Request) :-
    retractall(facto(_, _, _)),
    reply_json(_{status:"Facts removed successfully"}).