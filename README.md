# Bot for Alpha Omega clan

Bot I created to help with some clan functionalities. Hosted on Heroku personal account.

All requests should begin with the '?' character, followed by any arguments

## Weapon Rolls

This returns an embed with the best rolls for each slot on in-game weapons. This information is provided through an API that is updated with new information by clan member Jiangshi.

### Usage

```javascript
// General
?rolls <weapon_name> [pve|pvp]

// Examples
?rolls tranquility
?rolls bad omens pvp
```

### Output

<img src="images/rolls_output.PNG" alt="Output for tranquility" height="480"/>
<img src="images/rolls_bad_output.PNG" alt="Output for bad omens pvp" height="480"/>



## Active Members: ?active

This returns a message that displays all members who have sent a message since the server last booted. The server boots every 24 hours, so it isn't the greatest


