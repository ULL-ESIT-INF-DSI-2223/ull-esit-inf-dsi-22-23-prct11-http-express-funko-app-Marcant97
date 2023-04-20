import express from 'express';
import {spawnSync} from 'child_process';

const app = express();

app.get('/execmd', (req, res) => {
  console.log(req.query);
  if (!req.query.cmd) {
    return res.status(400).send();
  } 
  else {
    if (req.query.args) { // si hay args
      const command = spawnSync(req.query.cmd.toString(), req.query.args.toString().split(' '));
      if (command.stderr.toString()) {
        return res.status(500).send({
          cmd : req.query.cmd.toString(),
          args : req.query.args.toString(),
          error: command.stderr.toString()
        });
      }
      else {
        return res.send({
          cmd : req.query.cmd.toString(),
          args : req.query.args.toString(),
          salida: command.stdout.toString()
        });
      }
    }
    else { // si no hay args
      const command = spawnSync(req.query.cmd.toString());
      return res.send({
        cmd : req.query.cmd.toString(),
        salida: command.stdout.toString()
      })
    }
  }
});

app.get('*', (req, res) => {
  res.status(404).send();
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});