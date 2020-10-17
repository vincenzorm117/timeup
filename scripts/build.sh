#!/bin/bash

cd ../frontend-angular
ng build --prod --aot --verbose \
    && rm -r ../app \
    && cp -r ./dist/angular-frontend ../app
