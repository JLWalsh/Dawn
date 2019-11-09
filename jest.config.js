module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "moduleNameMapper": {
        "^@dawn/(.*)$": "<rootDir>/src/dawn/$1",
        "^@util/(.*)$": "<rootDir>/src/util/$1"
    }
};
