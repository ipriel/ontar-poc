const _svgs: { [key: string]: JSX.Element } = {};

export function registerSVGs(svgs: { [key: string]: JSX.Element }) {
    for (const [name, svg] of Object.entries(svgs)) {
        if (_svgs[name])
            console.error(`duplicate key in registerSVGs: "${name}" has already been registered`)
        else
            _svgs[name] = svg;
    }
}

export function getSVG(name: string) {
    return _svgs[name];
}