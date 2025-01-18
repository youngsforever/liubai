
/********************** Hello World *******************/
export interface Res_HelloWorld {
  stamp: number
}

export interface Res_UserLoginInit {
  publicKey?: string
  githubOAuthClientId?: string
  googleOAuthClientId?: string
  wxGzhAppid?: string
  state?: string
}