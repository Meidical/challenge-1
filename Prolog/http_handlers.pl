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
        atomic_list_concat([LowerName, 'CF'], '', Key)
    ),
    JSON1),

    (   facto(PatientID, _, via_aerea_dificil(true))
    ->  Bool = @(true)
    ;   Bool = @(false)
    ),
    append(JSON1, [difficultAirwayPredicted=Bool], JSON2),
 
    % Encontrar processo recomendado
    facto(PatientID, _, id_prox_facto(N)),
    facto(PatientID, _, rec_processo(N, ValorRec)),
    append(JSON2, [recommendedApproach=ValorRec], JSON3),

    % Encontrar id do próximo processo
    facto(PatientID, _, id_prox_facto(NFacto)),
    append(JSON3, [nextFactId=NFacto], JSON4),
    
    % Justificar resultados da mnemónica
    facto(PatientID, IDVA, via_aerea_dificil(_)),
    como_json(PatientID, IDVA, JustMnemonicas),
    append(JSON4, [justification=JustMnemonicas], JSONFinal),

    retractall(facto(PatientID, _, id_prox_facto(_))).





% HTTP GET para explicações "como"
:- http_handler(root(api/explain), get_explanation_json, []).
get_explanation_json(Request) :-
    http_parameters(Request, [
        id(ID, [integer]),
        patientId(PatientID, [string])
    ]),
    como_json(PatientID, ID, JSON),
    reply_json(json([justification=JSON])).



% HTTP POST para explicaoes "whynot"
:- http_handler(root(api/whynot), post_whynot, [method(post)]).
post_whynot(Request) :-
    http_read_json_dict(Request, Dict),

    % Expect: { "patientId": "001", "fact": {"predicate": "processo", "args": ["Alternative Technique", "SUCCESSFUL"]} }
    PatientID = Dict.patientId,
    FactDict = Dict.fact,
    string_to_atom(FactDict.predicate, PredAtom),
    Args = FactDict.args,
    Term =.. [PredAtom | Args],   % dynamically build the term, e.g. processo("Alternative Technique", "SUCCESSFUL")

    whynot_json(PatientID, Term, JSON),
    reply_json(JSON).




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
    facto(PatientID, ID, rec_processo(N, Rec)),
    (   facto(PatientID, N1, conclusao(true)),
        reply_json(_{
            nextFactDescription: Rec, 
            nextFactId: -1,
            justification_id: N1
        })
    ;   reply_json(_{
            nextFactDescription: Rec, 
            nextFactId: N,
            justification_id: ID
        })
    ).


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