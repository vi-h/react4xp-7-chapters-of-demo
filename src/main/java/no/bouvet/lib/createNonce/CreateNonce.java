package no.bouvet.lib.createNonce;

import java.util.Base64;
import java.util.Base64.Encoder;
import java.security.SecureRandom;


public class CreateNonce {

    public String getCreatedNonce () {
        SecureRandom random = new SecureRandom();
        Encoder encoder = Base64.getUrlEncoder().withoutPadding();
        byte[] randomBytes = new byte[32];
        random.nextBytes(randomBytes);
        return encoder.encodeToString(randomBytes);
    }


    public static void main(String... args) {
        CreateNonce createNonce = new CreateNonce();
        try {
            createNonce.getCreatedNonce();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
