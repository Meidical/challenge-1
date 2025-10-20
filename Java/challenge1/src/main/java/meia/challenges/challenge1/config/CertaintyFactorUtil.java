package meia.challenges.challenge1.config;

import  meia.challenges.challenge1.config.CertaintyFactorConfig;

public class CertaintyFactorUtil {
    public static double getCertaintyFactor(String parameter) {
        return CertaintyFactorConfig.getCertaintyFactor(parameter);
    }
}
