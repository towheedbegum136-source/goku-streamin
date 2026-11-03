# Goku Streamin

PROJECT: GOKU STREAMING

Act as a professional full-stack developer and UI/UX designer. Build a complete, responsive anime streaming website called Goku Streaming.

IMPORTANT: Use my existing Goku Streaming website as the visual reference:
https://lovable.dev/projects/baae59ba-2848-44c7-9153-6f01d9386be9

I am creating a NEW project, but I want its appearance to match my existing website as closely as possible. Inspect the reference if accessible. Do not invent a completely different design.

1. DESIGN AND BRANDING

- Website name: Goku Streaming.
- Use my uploaded Goku Streaming logo exactly as provided.
- Display the same logo in the navbar, footer, login, signup, admin panel, and other relevant pages.
- Use a blue and purple theme similar to my existing website.
- Keep the same style of navigation, cards, spacing, typography, and overall layout wherever the reference allows.
- Make the site responsive on mobile, tablet, and desktop.
- Do not replace my uploaded logo with an AI-generated logo.

2. HERO BANNER

- Create a large, cinematic anime hero banner similar to my existing website.
- Show Goku, Luffy, and Naruto prominently in the background, with Goku Streaming branding.
- Preserve the dramatic anime atmosphere and blue-purple color palette.
- Include a featured anime title, description, Watch Now button, and Details button.
- Use appropriate artwork and do not let the logo cover the characters.
- If specific artwork cannot be used, ask me to provide suitable images instead of using unrelated characters.

3. AUTHENTICATION

Implement real, working:

- Sign Up
- Login
- Logout / Sign Out
- Google account sign-in using Google OAuth
- User session persistence
- Proper authentication error messages
- Protected account pages

Use a secure authentication provider such as Supabase Auth. Explain any Google OAuth setup required. Do not create fake login buttons.

4. ADMIN PANEL — ONLY MY ACCOUNT

Administrator email: mohdahadkhan76@gmail.com

- Only this exact email address may have administrator permissions.
- Regular users may create accounts and sign in, but must never access admin features.
- Add a protected Admin Dashboard.
- Enforce administrator authorization on the server/database side, not merely by hiding the admin button.
- Use secure database policies and role checks.
- Never expose passwords, private keys, or secret tokens.
- Do not make every registered user an administrator.

5. ANIME AND EPISODE MANAGEMENT

Inside the Admin Dashboard, allow me to:

- Add new anime.
- Add anime titles, descriptions, thumbnails, language, and genre.
- Add episode titles and episode numbers.
- Add or update video URLs.
- Edit existing anime and episode details.
- Delete episodes only after confirmation.
- Publish or unpublish anime and episodes.
- Save all changes persistently in the database.

New episodes should automatically appear in the appropriate anime pages.

Accept supported video URLs and embed them when permitted by the provider. Do not claim that every arbitrary link will play as a video. Clearly show an error or helpful message for unsupported links.

6. LANGUAGE OPTIONS

- Add a language selector to the website.
- Support English, Hindi, and Telugu interface options.
- Translate navigation, buttons, labels, and other interface text.
- Allow anime and episodes to be labeled by their available audio language.
- Clearly distinguish dubbed and subtitled versions.
- Do not claim that an anime has a Hindi or Telugu dub unless that version is actually available.

7. PAGES AND NAVIGATION

Create:

- Home
- Anime listing
- Anime details
- Episode/video player
- Search results
- Login
- Sign Up
- User account
- Admin Dashboard
- 404 Not Found

Keep Goku Streaming branding consistent on every page.

8. SEARCH AND STREAMING

- Add functional anime search.
- Add genre, language, and status filters.
- Show anime cards with thumbnails and descriptions.
- Create an episode list for each anime.
- Add previous episode and next episode navigation.
- Show helpful empty states when no episodes have been added.
- Do not populate the site with unrelated random YouTube videos.
- Use only configured video URLs and authorized content.

9. DATABASE AND SECURITY

- Configure a persistent database, preferably Supabase.
- Store anime, episodes, language information, and video URLs.
- Ensure that only my authorized administrator account can create, edit, publish, or delete content.
- Configure database access policies correctly.
- Keep user authentication and admin permissions secure.
- Never expose secret keys in frontend code.
- Explain any credentials or external services that I must configure.

10. FINAL REQUIREMENTS

- Use the project name Goku Streaming everywhere.
- Use my uploaded logo unchanged.
- Match my existing website's appearance as closely as possible.
- Keep the blue-purple theme and the Goku, Luffy, and Naruto hero banner.
- Make the website functional, not just a static visual mockup.
- Test signup, login, Google OAuth, logout, admin authorization, episode management, language selection, search, and routing.
- Fix errors before declaring the project complete.
- If the reference website cannot be accessed, ask me for screenshots rather than guessing its exact layout.
- Do not claim a feature works until it has been implemented and tested.

Build the website in stages, starting with the visual layout and branding, then authentication, database, and admin functionality. Clearly explain any remaining setup steps.wwebsite name goku Streaming.in hero banner i give you example make like this hero banner. Mohdahadkhan76@gmail.com

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://goku-streamin.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/108ee5fc-1139-4173-be00-2dc4c3348e52).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
