const gulp = require('gulp');
const { spawn } = require('child_process');
const browserSync = require('browser-sync').create();
const colors = require('ansi-colors');
const log = require('fancy-log');

colors.theme({
  danger: colors.red,
  dark: colors.dim.gray,
  disabled: colors.gray,
  em: colors.italic,
  heading: colors.bold.underline,
  info: colors.cyan,
  muted: colors.dim,
  primary: colors.blue,
  strong: colors.bold,
  success: colors.green,
  underline: colors.underline,
  warning: colors.yellow,
});

gulp.task('default', function() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    single: true,
    ghostMode: false,
    open: false,
    notify: false,
  });

  const ember = spawn('ember', ['build', '--watch']);

  ember.stdout.on('data', data => {
    log.info(colors.info(`${data}`).trim());
  });

  ember.stderr.on('data', data => {
    log.error(colors.danger.strong(`${data}`).trim());
  });

  ember.on('close', code => {
    log.info(colors.muted(`child process exited with code ${code}`).trim());
  });

  gulp
    .watch(['dist/assets/vendor.js', 'dist/assets/auth0client.js'], {
      interval: 1000,
      delay: 1000,
      usePolling: true,
    })
    .on('change', browserSync.reload);

  gulp
    .watch(['dist/assets/vendor.css', 'dist/assets/auth0client.css'], {
      interval: 1000,
      delay: 1000,
      usePolling: true,
    })
    .on('change', browserSync.reload);

  return ember;
});
