- <a name="blackfluxrobo-config-plugin-task-idx-ref-assorteddefaultjson">:open_file_folder:</a> <a href="#blackfluxrobo-config-plugin-task-ref-assorteddefaultjson">`assorted/@default.json`</a>
  - <a name="blackfluxrobo-config-plugin-task-idx-ref-structdefault">:open_file_folder:</a> <a href="#blackfluxrobo-config-plugin-task-ref-structdefault">`struct/#default`</a>
    - <a name="blackfluxrobo-config-plugin-task-idx-ref-structtest-index-spec">:clipboard:</a> <a href="#blackfluxrobo-config-plugin-task-ref-structtest-index-spec">`struct/test-index-spec`</a>
    - <a name="blackfluxrobo-config-plugin-task-idx-ref-structsrc-index">:clipboard:</a> <a href="#blackfluxrobo-config-plugin-task-ref-structsrc-index">`struct/src-index`</a>
  - <a name="blackfluxrobo-config-plugin-task-idx-ref-serverlessdefault">:open_file_folder:</a> <a href="#blackfluxrobo-config-plugin-task-ref-serverlessdefault">`serverless/#default`</a>
    - <a name="blackfluxrobo-config-plugin-task-idx-ref-serverlessserverless-data">:clipboard:</a> <a href="#blackfluxrobo-config-plugin-task-ref-serverlessserverless-data">`serverless/serverless-data`</a>
    - <a name="blackfluxrobo-config-plugin-task-idx-ref-serverlessserverless-api">:clipboard:</a> <a href="#blackfluxrobo-config-plugin-task-ref-serverlessserverless-api">`serverless/serverless-api`</a>

# :open_file_folder: <a name="blackfluxrobo-config-plugin-task-ref-assorteddefaultjson">assorted/@default.json</a> (<a href="#blackfluxrobo-config-plugin-task-idx-ref-assorteddefaultjson">`index`</a>)

Manages files for monitoring project.

<table>
  <tbody>
    <tr>
      <th>Targets</th>
      <th>Requires</th>
      <th>Variables</th>
    </tr>
    <tr>
      <td align="left" valign="top">
        <ul>
<code>project</code><br/>
<code>├─&nbsp;serverless</code><br/>
<code>│&nbsp;&nbsp;├─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-serverlessapiyml">api.yml</a></code><br/>
<code>│&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-serverlessdatayml">data.yml</a></code><br/>
<code>├─&nbsp;src</code><br/>
<code>│&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-srcindexjs">index.js</a></code><br/>
<code>└─&nbsp;test</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-testindexspecjs">index.spec.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-chai">chai</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-serverless">serverless</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-aws">aws</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-var-ref-enablecloudtrail">enableCloudTrail</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## :open_file_folder: <a name="blackfluxrobo-config-plugin-task-ref-structdefault">struct/#default</a> (<a href="#blackfluxrobo-config-plugin-task-idx-ref-structdefault">`index`</a>)

Manages structure files for monitoring project.

<table>
  <tbody>
    <tr>
      <th>Targets</th>
      <th>Requires</th>
    </tr>
    <tr>
      <td align="left" valign="top">
        <ul>
<code>project</code><br/>
<code>├─&nbsp;src</code><br/>
<code>│&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-srcindexjs">index.js</a></code><br/>
<code>└─&nbsp;test</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-testindexspecjs">index.spec.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-chai">chai</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="blackfluxrobo-config-plugin-task-ref-structtest-index-spec">struct/test-index-spec</a> (<a href="#blackfluxrobo-config-plugin-task-idx-ref-structtest-index-spec">`index`</a>)

_Updating <a href="#blackfluxrobo-config-plugin-target-ref-testindexspecjs">test/index.spec.js</a> using <a href="#blackfluxrobo-config-plugin-strat-ref-overwrite">overwrite</a>._

- Define main test file.

<table>
  <tbody>
    <tr>
      <th>Targets</th>
      <th>Requires</th>
    </tr>
    <tr>
      <td align="left" valign="top">
        <ul>
<code>project</code><br/>
<code>└─&nbsp;test</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-testindexspecjs">index.spec.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-chai">chai</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="blackfluxrobo-config-plugin-task-ref-structsrc-index">struct/src-index</a> (<a href="#blackfluxrobo-config-plugin-task-idx-ref-structsrc-index">`index`</a>)

_Updating <a href="#blackfluxrobo-config-plugin-target-ref-srcindexjs">src/index.js</a> using <a href="#blackfluxrobo-config-plugin-strat-ref-overwrite">overwrite</a>._

- Define main code file.

<table>
  <tbody>
    <tr>
      <th>Targets</th>
      <th>Requires</th>
    </tr>
    <tr>
      <td align="left" valign="top">
        <ul>
<code>project</code><br/>
<code>└─&nbsp;src</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-srcindexjs">index.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## :open_file_folder: <a name="blackfluxrobo-config-plugin-task-ref-serverlessdefault">serverless/#default</a> (<a href="#blackfluxrobo-config-plugin-task-idx-ref-serverlessdefault">`index`</a>)

Manages configuration files for monitoring project.

<table>
  <tbody>
    <tr>
      <th>Targets</th>
      <th>Requires</th>
      <th>Variables</th>
    </tr>
    <tr>
      <td align="left" valign="top">
        <ul>
<code>project</code><br/>
<code>└─&nbsp;serverless</code><br/>
<code>&nbsp;&nbsp;&nbsp;├─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-serverlessapiyml">api.yml</a></code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-serverlessdatayml">data.yml</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-serverless">serverless</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-aws">aws</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-var-ref-enablecloudtrail">enableCloudTrail</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="blackfluxrobo-config-plugin-task-ref-serverlessserverless-data">serverless/serverless-data</a> (<a href="#blackfluxrobo-config-plugin-task-idx-ref-serverlessserverless-data">`index`</a>)

_Updating <a href="#blackfluxrobo-config-plugin-target-ref-serverlessdatayml">serverless/data.yml</a> using <a href="#blackfluxrobo-config-plugin-strat-ref-overwrite">overwrite</a>._

- Define data stack resource definition file.

<table>
  <tbody>
    <tr>
      <th>Targets</th>
      <th>Requires</th>
    </tr>
    <tr>
      <td align="left" valign="top">
        <ul>
<code>project</code><br/>
<code>└─&nbsp;serverless</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-serverlessdatayml">data.yml</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-serverless">serverless</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-aws">aws</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="blackfluxrobo-config-plugin-task-ref-serverlessserverless-api">serverless/serverless-api</a> (<a href="#blackfluxrobo-config-plugin-task-idx-ref-serverlessserverless-api">`index`</a>)

_Updating <a href="#blackfluxrobo-config-plugin-target-ref-serverlessapiyml">serverless/api.yml</a> using <a href="#blackfluxrobo-config-plugin-strat-ref-overwrite">overwrite</a>._

- Define api stack resource definition file.

<table>
  <tbody>
    <tr>
      <th>Targets</th>
      <th>Requires</th>
      <th>Variables</th>
    </tr>
    <tr>
      <td align="left" valign="top">
        <ul>
<code>project</code><br/>
<code>└─&nbsp;serverless</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#blackfluxrobo-config-plugin-target-ref-serverlessapiyml">api.yml</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-serverless">serverless</a></li>
          <li><a href="#blackfluxrobo-config-plugin-req-ref-aws">aws</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#blackfluxrobo-config-plugin-var-ref-enablecloudtrail">enableCloudTrail</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

------

## Requires

### <a name="blackfluxrobo-config-plugin-req-ref-javascript">javascript</a> ([`link`](https://en.wikipedia.org/wiki/JavaScript)) 

*Programming Language.*

JavaScript, often abbreviated as JS, is a high-level, interpreted programming language that conforms to the ECMAScript specification.
It is characterized as dynamic, weakly typed, prototype-based and multi-paradigm.

### <a name="blackfluxrobo-config-plugin-req-ref-chai">chai</a> ([`link`](https://www.chaijs.com/)) 

*JavaScript assertion library.*

Chai is a BDD / TDD assertion library for node and the browser that can be paired with any javascript testing framework.

### <a name="blackfluxrobo-config-plugin-req-ref-serverless">serverless</a> ([`link`](https://serverless.com/)) 

*Serverless Framework.*

The Serverless Framework is a free and open-source web framework that was 
developed for building serverless applications.

### <a name="blackfluxrobo-config-plugin-req-ref-aws">aws</a> ([`link`](https://aws.amazon.com/)) 

*Amazon Web Services.*

Amazon Web Services (AWS) is a subsidiary of Amazon that provides on-demand cloud 
computing platforms to individuals, companies and governments, on a metered pay-as-you-go basis.

------

## Variables

### <a name="blackfluxrobo-config-plugin-var-ref-enablecloudtrail">enableCloudTrail</a>  : `string`

*Whether or not to enable CloudTrail.*

Should only be enabled if cloud trail logging is not already enabled on this aws account. Otherwise significant costs can occur. Set to either "true" or "false".

------

## Targets

### <a name="blackfluxrobo-config-plugin-target-ref-testindexspecjs">test/index.spec.js</a>  

:small_red_triangle: <a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a>

:small_blue_diamond: `other`

*Main project test file.*

Contains basic testing of code functionality for monitoring.

### <a name="blackfluxrobo-config-plugin-target-ref-srcindexjs">src/index.js</a>  

:small_red_triangle: <a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a>

:small_blue_diamond: `other`

*Main project file.*

Contains code functionality for monitoring.

### <a name="blackfluxrobo-config-plugin-target-ref-serverlessdatayml">serverless/data.yml</a>  

:small_red_triangle: <a href="#blackfluxrobo-config-plugin-req-ref-serverless">serverless</a>, <a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a>

:small_blue_diamond: `yml`

*Data stack resource definition.*

Contains monitoring data stack resource definitions.

### <a name="blackfluxrobo-config-plugin-target-ref-serverlessapiyml">serverless/api.yml</a>  

:small_red_triangle: <a href="#blackfluxrobo-config-plugin-req-ref-serverless">serverless</a>, <a href="#blackfluxrobo-config-plugin-req-ref-javascript">javascript</a>

:small_blue_diamond: `yml`

*Api stack resource definition.*

Contains monitoring api stack resource definitions.

------

## Strategies

### <a name="blackfluxrobo-config-plugin-strat-ref-overwrite">overwrite</a>  

:small_blue_diamond: `any`

*Simply replace the old with the new content.*

