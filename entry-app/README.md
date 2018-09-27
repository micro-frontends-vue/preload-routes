| API     |          Explain           |
| :------ | :------------------------: |
| `async` | 脚本将在页面继续解析时执行 |
| `defer` |  在页面完成解析时执行脚本  |

**注意: **

- `defer` 只对外部脚本有效
- 如果同时存在 `async` 和 `defer`，应用 `async` 的执行规则

## 参考

- [HTML <script> defer Attribute](https://www.w3schools.com/tags/att_script_defer.asp)
