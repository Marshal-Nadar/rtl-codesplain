import { screen, render, act } from "@testing-library/react";
import { func } from "prop-types";
import { MemoryRouter } from "react-router";
import { async } from "validate.js";
import RepositoriesListItem from "./RepositoriesListItem";

// jest.mock("../tree/FileIcon", () => {
//   //Content of FileIcon.js
//   return () => {
//     return "File Icon Component";
//   };
// });

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
}

test("shows a link github homepage for this repository", async () => {
  const { repository } = renderComponent();

  // screen.debug();
  // await pause();
  // screen.debug();

  await screen.findByRole("img", {
    name: /Javascript/i,
  });

  const link = screen.getByRole("link", {
    name: /github repository/i,
  });

  expect(link).toHaveAttribute("href", repository.html_url);

  // await act(async () => {
  //   await pause();
  // });
});

const pause = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

test("shows a fileicons with appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", {
    name: /javascript/i,
  });

  expect(icon).toHaveClass("js-icon");
});

test("shows the link to code editor page", async () => {
  const { repository } = renderComponent();

  const icon = await screen.findByRole("img", {
    name: /javascript/i,
  });

  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });

  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});
