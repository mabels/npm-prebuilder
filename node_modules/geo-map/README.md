# geo-map

> A facade that abstracts over the Google and HERE map JavaScript SDKs

## Install

```sh
npm install geo-map
```

## Usage

```ts
import { GeoMap } from "geo-map";

async function main() {
  const element = document.getElementById('map');

  const map = GeoMap.create({
    config: {
      provder: Types.GeoMapProvider.Google,
      auth: {
        apiKey: '',
      }
    }
  });

  await map.mount(element, { center: { lat: 0, lng: 0 } })
}

main().catch(err => {
  throw err;
})
```

## License

Apache License 2.0