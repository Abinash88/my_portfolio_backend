export type singupDataTypes = {
  name: string;
  email: string;
  password: string;
};

export type loginDataTypes = {
  email: string;
  password: string;
};

export type DataBaseDataTypes = {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export type userTokenId = {
  userName: string;
  id: number;
  iat: number;
  exp: number;
};

export type HomeData = {
  copy_email: string;
  logo_name: string;
  title: string;
  description: string;
};
