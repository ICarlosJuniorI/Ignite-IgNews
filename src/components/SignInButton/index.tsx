import { FaGithub, FaGoogle } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

export default function SignInButton() {
  const { data: session } = useSession();

  return session ? ( // Verifica se o usuário está logado
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()} // Ao clicar o usuário é deslogado
    >
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <>
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('github')} // Ao clicar o usuário realiza o login
    >
      <FaGithub color="#eba417" />
      Sign In with Github
    </button>
    {/* <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('google')}
    >
      <FaGoogle color="#eba417" />
      Sign In with Google
    </button> */}
    </>
  )
}