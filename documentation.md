# Colab-Sidian '''dockumentation'''

## Message Format

- Websockets
  - json

## JSON-Format

```JSON
{
  "type" : 'type',
  "payload" : 'payload for specified type',
}
```

### types

| type | meaning                               |
| ---- | ------------------------------------- |
| "d+" | Add Dir                               |
| "d-" | Remove Dir                            |
| "f+" | Add File                              |
| "f-" | Remove File                           |
| "t+" | Addition in File                      |
| "t-" | Deletion in File                      |
| "p"  | (from Server) is client still alive ? |
| "p"  | (from Client) client is still alive ! |

> "ping" and "pong" dont have a "payload"

### payloads for 'd'-types

#### "d>"

> moves a directory (mv 'from' 'to')

```JSON
{
  "from": "path/to/old/dir/from/vault/base/dir",
  "to"  : "path/to/new/dir/from/vault/base/dir"
}
```

#### "d+"

> can create multiple nested folders at once (mkdir -p 'path')

```JSON
{
  "path": "path/to/new/dir/from/vault/base/dir"
}
```

#### "d-"

> can remove multiple nested folders at once (rm -rf 'path')

```JSON
{
  "path": "path/to/deleted/dir/from/vault/base/dir"
}
```

### payloads for 'f'-types

#### "f>"

> moves a file (mv 'from' 'to')

```JSON
{
  "from": "path/to/old/file/location/from/vault/base/dir",
  "to"  : "path/to/new/file/location/from/vault/base/dir"
}
```

#### "f+"

> adds one specidies file (touch 'path')

```JSON
{
  "path": "path/to/addet/file/from/vault/base/dir"
}
```

#### "f-"

> removes one specified file (rm 'path')

```JSON
{
  "path": "path/to/deleted/file/from/vault/base/dir"
}
```

### payloads for 't'-types

#### pos

```JSON
{
  "l": line_number,
  "c": char_number
}
```

#### "t+"

> adds specified modification to specified file (rm 'path')

```JSON
{
  "path": "path/to/modified/file",
  "pos": pos,
  "text": "content to be addet"
}
```

#### "t-"

> removes one specified file (rm 'path')

```JSON
{
  "path": "path/to/deleted/file/from/vault/base/dir",
  "from": pos,
  "to": pos
}
```
