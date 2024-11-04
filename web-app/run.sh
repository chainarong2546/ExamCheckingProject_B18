#!/bin/bash

npm ci 
npm run build

# Check if the static folder exists in .next/standalone/.next/
if [ ! -d ".next/standalone/.next/static" ]; then
    echo "Static folder not found in .next/standalone/.next/, copying from .next/"
    
    # Copy the static folder from .next/ to .next/standalone/.next/
    cp -r .next/static .next/standalone/.next/
    cp -r public .next/standalone/
    
    echo "Static folder copied."
else
    echo "Static folder already exists."
fi

# Run the Next.js standalone server
node .next/standalone/server.js
