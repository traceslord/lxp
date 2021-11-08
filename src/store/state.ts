export interface State {
  userPhone: string;
  userName: string;
  userAvatar: string;
  authPermissions: string[];
}

export const state: State = {
  userPhone: "",
  userName: "",
  userAvatar: "",
  authPermissions: [],
};
