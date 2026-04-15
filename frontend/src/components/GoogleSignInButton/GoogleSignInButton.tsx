import { GoogleLogin } from "@react-oauth/google";

interface Props {
  onCredential: (idToken: string) => Promise<void>;
}

export default function GoogleSignInButton({ onCredential }: Props) {
  return (
    <GoogleLogin
      onSuccess={(res) => {
        if (res.credential) onCredential(res.credential);
      }}
      width={320}
      use_fedcm_for_button
    />
  );
}

