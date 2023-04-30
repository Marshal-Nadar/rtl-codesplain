import { SignInIcon } from "@primer/octicons-react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { SWRConfig } from "swr";
import { createServer } from "../../test/server";
import AuthButtons from "./AuthButtons";

async function renderComponent() {
  render(
    // For solving caching issue
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  await screen.findAllByRole("link");
}

describe("when user is signed in", () => {
  // createServer ---> GET 'api/user' ---> { user: { id: 3, email: "micheal@micheal.com" } }
  createServer([
    {
      method: "get",
      path: "/api/user",
      res: () => {
        console.log("LOGGED IN RESPONSE");

        return { user: { id: 3, email: "micheal@micheal.com" } };
      },
    },
  ]);
  test("signin and signed up are not visible", async () => {
    await renderComponent();

    const signInButton = screen.queryByRole("link", { name: /sign in/i });
    const signUpButton = screen.queryByRole("link", { name: /sign up/i });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test("signout is visible", async () => {
    await renderComponent();

    const signOutButton = screen.getByRole("link", {
      name: /sign out/i,
    });

    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});

describe("when user is not signed in", () => {
  // createServer ---> GET 'api/user' ---> { user: null }
  createServer([
    {
      method: "get",
      path: "/api/user",
      res: () => {
        console.log("NOT LOGGED IN RESPONSE");
        return { user: null };
      },
    },
  ]);

  test("sign in and sign out are visible", async () => {
    await renderComponent();

    // screen.debug();
    // await pause();
    // screen.debug();

    const singInButton = screen.getByRole("link", {
      name: /sign in/i,
    });

    const signUpButton = screen.getByRole("link", {
      name: /sign up/i,
    });

    expect(singInButton).toBeInTheDocument();
    expect(singInButton).toHaveAttribute("href", "/signin");
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/signup");
    // await screen.findAllByRole("link");
    // screen.debug();
    // await pause();
    // screen.debug();
  });

  test("sign out is not visible", async () => {
    await renderComponent();

    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });

    expect(signOutButton).not.toBeInTheDocument();

    // await screen.findAllByRole("link");
  });
});

const pause = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};
