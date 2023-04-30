import { screen, render } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import { async } from "validate.js";
import { createServer } from "../test/server";

// GOAL
createServer([
  {
    path: "/api/repositories",
    res: (req) => {
      const language = req.url.searchParams.get("q").split("language:")[1];
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);
//

// // const handler = [
// //   rest.get("api/repositories", (req, res, ctx) => {
// //     const language = req.url.searchParams.get("q").split("language:")[1];
// //     console.log(language);

// //     return res(
// //       ctx.json({
// //         items: [
// //           { id: 1, full_name: `${language}_one` },
// //           { id: 1, full_name: `${language}_two` },
// //         ],
// //       })
// //     );
// //   }),
// // ];

// // const server = setupServer(...handler);

// beforeAll(() => {
//   server.listen();
// });

// afterEach(() => {
//   server.resetHandlers();
// });

// afterAll(() => {
//   server.close();
// });

test("render two links for each language", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );
  // await pause();
  // screen.debug();
  // Loop over each language
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];
  // For each language, make sure we see two links
  for (let language of languages) {
    console.log("dfghjklnbhjjkljh", language);
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });
    console.log("jhgfddfdf", links);
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
    // return links;
  }
  // Assert the links have the appropriate full_name
});

const pause = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};
