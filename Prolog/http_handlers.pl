% HTTP GET para obter factos do paciente
:- http_handler(root(PatientIDA/facts), get_facts_json(PatientIDA), []).
get_facts_json(PatientIDA, _Request) :-

    atom_string(PatientIDA, PatientID),

    mostra_factos_json(PatientID, JSON),
    reply_json(JSON).




% HTTP GET para obter todos os factos
:- http_handler(root(facts), get_facts_json, []).
get_facts_json(_Request) :-
    mostra_factos_json(JSON),
    reply_json(JSON).




% HTTP POST para inferir probabilidade de via aérea difícil
:- http_handler(root(assessment), post_inferir_via_aerea, [method(post)]).
post_inferir_via_aerea(Request) :-
    http_read_json_dict(Request, Dict),
    inferir_via_aerea(Dict),
    PatientID = Dict.patientId,
    build_inferir_via_aerea_json(PatientID, JSONFinal),
    reply_json(json(JSONFinal)).

build_inferir_via_aerea_json(PatientID, JSONFinal) :-
    % Encontrar CFs para cada mnemónica
    findall(Name=CF, facto(PatientID, _, mnemonica_cf(Name, CF)), JSON1),

    (   facto(PatientID, _, via_aerea_dificil(true))
    ->  append(JSON1, [difficultAirwayPredicted=true], JSON2)
    ;   append(JSON1, [difficultAirwayPredicted=false], JSON2)
    ),

    % Encontrar processo recomendado
    ultimo_rec_processo(PatientID, ValorRec),
    append(JSON2, [recommendedApproach=ValorRec], JSON3),

    % Encontrar id do próximo processo
    facto(PatientID, _, id_prox_facto(NFacto)),
    append(JSON3, [nextFactId=NFacto], JSONFinal),

    retractall(facto(PatientID, _, id_prox_facto(_))),
    retractall(facto(PatientID, _, id_prox_facto_alt(_))).




% HTTP GET para explicações "como"
:- http_handler(root(explain), get_explanation_json, []).
get_explanation_json(Request) :-
    http_parameters(Request, [
        id(ID, [integer]),
        patientId(PatientID, [optional('unknown')])
    ]),
    %como_json(PatientID, ID, JSON),
    reply_json(JSON).




% HTTP POST para Laringoscopia Direta
:- http_handler(root(assessment/PatientIDA/facts/IDA), post_prox_processo(PatientIDA, IDA), [method(post)]).
post_prox_processo(PatientIDA, IDA, Request) :-

    atom_string(PatientIDA, PatientID),
    atom_string(IDA, ID),

    http_read_json_dict(Request, Dict),
    get_prox_processo(PatientID, ID, Dict),
    reply_processo_json(PatientID).
