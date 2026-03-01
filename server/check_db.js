import { exec } from 'child_process';
import fs from 'fs';

exec('npx prisma db push', (error, stdout, stderr) => {
    fs.writeFileSync('db_push_error.txt', `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n\nERROR:\n${error ? error.message : 'none'}`);
});
