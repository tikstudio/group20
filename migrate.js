import { Files, Messages, Users } from './models';

async function main() {
  await Users.sync({ alter: true, logging: true });
  await Messages.sync({ alter: true, logging: true });
  await Files.sync({ alter: true, logging: true });

  process.exit(0);
}

main();
