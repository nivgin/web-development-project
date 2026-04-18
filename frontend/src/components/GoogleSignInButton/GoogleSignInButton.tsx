import { GoogleLogin } from "@react-oauth/google";

interface Props {
  onCredential: (idToken: string) => Promise<void>;
  onFailure?: () => void;
}

export default function GoogleSignInButton({ onCredential, onFailure }: Props) {
  return (
    <GoogleLogin
      onSuccess={(res) => {
        if (res.credential) onCredential(res.credential);
      }}
      onError={onFailure}
      width={320}
      use_fedcm_for_button
    />
  );
}

