import demoData from "../data/demo-data.json";

export type UserData = {
  userId: number;
  userName: string;
  password: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  access: string | null;
  role: string | null;
};

export type LoginResponse = {
  status: "Success" | "Failed";
  message: string;
  accessToken: string | null;
  userData: UserData[] | null;
};

type LoginCredentials = {
  username: string;
  password: string;
};

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const user = demoData.users.find(
      (entry) =>
        entry.userName.toLowerCase() === credentials.username.trim().toLowerCase() &&
        entry.password === credentials.password,
    );

    if (!user) {
      throw new Error("Incorrect username or password.");
    }

    return {
      status: "Success",
      message: "Signed in to the local demo workspace.",
      accessToken: `demo-token-${user.userId}`,
      userData: [{ ...user, password: null }],
    };
  }
}

export const authService = new AuthService();
