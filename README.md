# Johnny 5 Discord Bot

### Things that it can do:
1. Play BlackJack.
2. Check the top 3 post (post with the most reactions) of the channel the command is called in.
3. Schedule a message to be sent at a later time
4. check if you have any messages scheduled
5. get basic user information
6. ping to check latency
7. IF you connect monogDB then it will keep track of user time in a voice channel
8. Get leaderboard showing top users with most voice channel time


### Getting Started.

1. clone repo

2. install dependencies
   ```
   npm i
   ```

4. go to discord developer portal:
> 1.  create a new application (keep not of application id in genral information)
> 2.  under bot allow access to all 3 Privileged Gateway Intents
> 3.  your "token" (used in the following step) is also located in the bot section
  
4. make a .env file with the following items:
```
  guildId= { id of your discord server, right click on server and copy server id}
  clientId= { application id from previous step }
  token= {token from the previou step, example: WTY3MzM1OTU0MDQxNDE1IzIzMA.Lk89eh.EH9k_iDm5QefuTzz6_uC4p_GJUZdxfNtnowrto }
  DatabaseURL= { I used mongoDB atlas, it is free, example: "mongodb+srv://<user>:<password>@cluster0.l1w1kq7.mongodb.net/?retryWrites=true&w=majority"}
```

6. Start the bot
   ```
   npm run test
   ```

