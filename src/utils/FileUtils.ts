import * as fs from 'fs';

const save = async (filename: string, data: any) => {
  const path = `${fs.realpathSync('.')}/build/tmp`;

  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) console.log(err);
  });

  fs.writeFile(`${path}/${filename}`, JSON.stringify(data, null, 2), (err) => {
    if (err) console.log(err);
  });
};

export default { save };
