const fs = require('fs');

function loadCommands(client) {
  let commandsArray = [];
  let commandsCount = 0;
  let commandNames = new Set(); // Añade esta línea

  const commandsFolder = fs.readdirSync('./Comandos');

  for (const folder of commandsFolder) {
    const commandFiles = fs.readdirSync(`./Comandos/${folder}`).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../Comandos/${folder}/${file}`);

      if (commandNames.has(commandFile.data.name)) { // Añade esta línea
        console.log(`El comando ${commandFile.data.name} está duplicado.`); // Añade esta línea
        continue; // Añade esta línea
      } // Añade esta línea

      commandNames.add(commandFile.data.name); // Añade esta línea

      const properties = { folder, ...commandFile };
      client.commands.set(commandFile.data.name, properties);

      commandsArray.push(commandFile.data.toJSON());
      commandsCount++;
    }
  }

  client.application.commands.set(commandsArray);

  console.log(`(/) ${commandsCount} Comandos cargados.`);
}

module.exports = { loadCommands };