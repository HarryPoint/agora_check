const HOST = '0.0.0.0';
const PORT = 3555;
const deploy = {
  repo: 'git@git.vm.snqu.com:snqu-network/snto/f2e/nm.yuema.cn.git',
};
module.exports = {
  apps: [
    {
      name: 'ad.snto.com',
      instances: 2,
      script: 'server/index.js',
      // 正式服
      env_production: {
        NODE_ENV: 'production',
        HOST,
        PORT,
      },
      // 测试服
      env_test: {
        NODE_ENV: 'production',
        HOST,
        PORT,
        TEST: true,
      },
    },
  ],

  deploy: {
    production: {
      ...deploy,
      path: '/app/www/node-server/nm.yuema.cn',
      ref: 'origin/master',
      user: 'staff',
      host: '148.70.177.83',
      'post-deploy':
        'yarn install && yarn build && pm2 reload ecosystem.config.js --env production',
    },
    development: {
      ...deploy,
      path: '/var/www/node-server/nm.yuema.cn',
      ref: 'origin/develop',
      user: 'root',
      host: '119.27.167.20',
      'post-deploy':
        'yarn install && yarn build && pm2 reload ecosystem.config.js --env development',
    },
  },
};
