---
title: Nightscout
description: Connect to Nightscout to play the Glucose Games
---

In order to play the games, you will need to have a continuous glucose monitor (CGM) and be connected to a [Nightscout](https://nightscout.github.io/) instance.

The games will pull your blood glucose data from the Nightscout API.
In order to do so, you must provide:
- Your Nightscout Base URL
- A Nightscout Access Token

## Getting your Nightscout Base URL

Your Nightscout Base URL is the URL that you use to access your Nightscout instance.
It will look something like `https://your-nightscout-instance.your-provider.com`.

Note that the Base URL does not include any paths or endpoints, just the root URL.
Note that the Base URL does not include a trailing slash.

## Getting your Nightscout Access Token

Your Nightscout Access Token is a secret key that allows the games to access your Nightscout data.

You can generate a new Access Token by following these steps:
1. Navigate to the admin page of your Nightscout instance. This is usually located at `https://your-nightscout-instance.your-provider.com/admin`
2. At the top of the page, click "Add new Subject"
3. Enter a name for the subject, it can be whatever you'd like
4. In Roles, enter: readable
5. Click "Save"
6. Copy the Access Token that is generated

## Providing your Nightscout information

Once you have your Nightscout Base URL and Access Token, you can provide them to the games by navigating to the [settings page](/account) page and entering them in the appropriate fields.

Once you have saved your Nightscout information, you should see a notice about the connection status.
If you see "Connected" you're ready to play!
Otherwise, check to make sure the information you entered was correct, and that the token you provided has the correct permissions.

## Disconnecting from Nightscout

If you'd like to disconnect from Nightscout for any reason, you can do so by navigating to the [settings page](/account) and clicking the trash can icon.

Note that The Glucose Games does not store your Nightscout data, so disconnecting will prevent the games from accessing any of your blood glucose data from Nightscout.

## Questions?

If you have any trouble connecting to Nightscout or have any questions, please reach out to us at [support@glucose.games](mailto:support@glucose.games).
