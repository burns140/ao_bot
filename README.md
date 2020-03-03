# Bot for Alpha Omega clan

Bot I created to help with some clan functionalities. Hosted on Heroku personal account.

All requests should begin with the '?' character, followed by any arguments

## Weapon Rolls

Returns an embed with the best rolls for each slot on in-game weapons. This information is provided through an API that is updated with new information by clan member Jiangshi.

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
<img src="images/rolls_bad_output.PNG" alt="Output for bad omens pvp" height="240"/>

## Best weapons in each weapon class

Returns an embed with the best weapons in each weapon class depending on what criteria you want. This information is provided through an API that is updated with new information by clan member Jiangshi.

### Usage

```javascript
// General
?best <weapon_class>

// Example
?best snipers
```

### Output

<img src="images/best_sniper_output.PNG" alt="Output for best snipers" height="400"/>

## Lore

Returns a message with the lore for an item. The information is retrieved through web scraping on [Ishtar Collective](https://www.ishtar-collective.net/).

### Usage

```javascript
// General
?lore <item_name>

// Example
?lore workhusk crown
```

### Output

<img src="images/lore_wormhusk_crown.PNG" alt="Lore output for wormhusk crown" height="360"/>


## Active Members: ?active

This returns a message that displays all members who have sent a message since the server last booted. The server boots every 24 hours, so it isn't the greatest


