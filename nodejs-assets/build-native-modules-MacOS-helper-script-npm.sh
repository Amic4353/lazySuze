#!/bin/bash
      # Helper script for Gradle to call npm on macOS in case it is not found
      export PATH=$PATH:/Users/amarischang/.nvm/versions/node/v12.2.0/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/amarischang/Documents/01_Code_Portal/JS/01_FS/stacks/lazySuze/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/amarischang/Documents/01_Code_Portal/JS/01_FS/stacks/lazySuze/node_modules/.bin:/Users/amarischang/.rbenv/bin:/Users/amarischang/.rbenv/shims:/Users/amarischang/.nvm/versions/node/v12.2.0/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/Postgres.app/Contents/Versions/latest/bin:/Users/amarischang/.rbenv/bin:/Users/amarischang/.rbenv/shims:/Users/amarischang/.nvm/versions/node/v12.2.0/bin
      npm $@
    