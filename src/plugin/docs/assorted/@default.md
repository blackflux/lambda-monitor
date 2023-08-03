- <a name="lambda-monitor-task-idx-ref-assorteddefaultjson">:open_file_folder:</a> <a href="#lambda-monitor-task-ref-assorteddefaultjson">`assorted/@default.json`</a>
  - <a name="lambda-monitor-task-idx-ref-structdefault">:open_file_folder:</a> <a href="#lambda-monitor-task-ref-structdefault">`struct/#default`</a>
    - <a name="lambda-monitor-task-idx-ref-structtest-hangler-spec">:clipboard:</a> <a href="#lambda-monitor-task-ref-structtest-hangler-spec">`struct/test-hangler-spec`</a>
    - <a name="lambda-monitor-task-idx-ref-structsrc-hangler">:clipboard:</a> <a href="#lambda-monitor-task-ref-structsrc-hangler">`struct/src-hangler`</a>
    - <a name="lambda-monitor-task-idx-ref-structhowto">:clipboard:</a> <a href="#lambda-monitor-task-ref-structhowto">`struct/howto`</a>
  - <a name="lambda-monitor-task-idx-ref-serverlessdefault">:open_file_folder:</a> <a href="#lambda-monitor-task-ref-serverlessdefault">`serverless/#default`</a>
    - <a name="lambda-monitor-task-idx-ref-serverlessserverless-data">:clipboard:</a> <a href="#lambda-monitor-task-ref-serverlessserverless-data">`serverless/serverless-data`</a>
    - <a name="lambda-monitor-task-idx-ref-serverlessserverless-api-config">:clipboard:</a> <a href="#lambda-monitor-task-ref-serverlessserverless-api-config">`serverless/serverless-api-config`</a>
    - <a name="lambda-monitor-task-idx-ref-serverlessserverless-api">:clipboard:</a> <a href="#lambda-monitor-task-ref-serverlessserverless-api">`serverless/serverless-api`</a>

# :open_file_folder: <a name="lambda-monitor-task-ref-assorteddefaultjson">assorted/@default.json</a> (<a href="#lambda-monitor-task-idx-ref-assorteddefaultjson">`index`</a>)

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
<code>├─&nbsp;<a href="#lambda-monitor-target-ref-howtomd">HOWTO.md</a></code><br/>
<code>├─&nbsp;serverless</code><br/>
<code>│&nbsp;&nbsp;├─&nbsp;<a href="#lambda-monitor-target-ref-serverlessapiyml">api.yml</a></code><br/>
<code>│&nbsp;&nbsp;├─&nbsp;<a href="#lambda-monitor-target-ref-serverlessdatayml">data.yml</a></code><br/>
<code>│&nbsp;&nbsp;└─&nbsp;api</code><br/>
<code>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-serverlessapiconfigyml">config.yml</a></code><br/>
<code>├─&nbsp;src</code><br/>
<code>│&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-srchanglerjs">hangler.js</a></code><br/>
<code>└─&nbsp;test</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-testhanglerspecjs">hangler.spec.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-javascript">javascript</a></li>
          <li><a href="#lambda-monitor-req-ref-chai">chai</a></li>
          <li><a href="#lambda-monitor-req-ref-serverless">serverless</a></li>
          <li><a href="#lambda-monitor-req-ref-aws">aws</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-var-ref-awsregion">awsRegion</a></li>
          <li><a href="#lambda-monitor-var-ref-enablecloudtrail">enableCloudTrail</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## :open_file_folder: <a name="lambda-monitor-task-ref-structdefault">struct/#default</a> (<a href="#lambda-monitor-task-idx-ref-structdefault">`index`</a>)

Manages structure files for monitoring project.

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
<code>├─&nbsp;<a href="#lambda-monitor-target-ref-howtomd">HOWTO.md</a></code><br/>
<code>├─&nbsp;src</code><br/>
<code>│&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-srchanglerjs">hangler.js</a></code><br/>
<code>└─&nbsp;test</code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-testhanglerspecjs">hangler.spec.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-javascript">javascript</a></li>
          <li><a href="#lambda-monitor-req-ref-chai">chai</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-var-ref-awsregion">awsRegion</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="lambda-monitor-task-ref-structtest-hangler-spec">struct/test-hangler-spec</a> (<a href="#lambda-monitor-task-idx-ref-structtest-hangler-spec">`index`</a>)

_Updating <a href="#lambda-monitor-target-ref-testhanglerspecjs">test/hangler.spec.js</a> using <a href="#lambda-monitor-strat-ref-overwrite">overwrite</a>._

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
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-testhanglerspecjs">hangler.spec.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-javascript">javascript</a></li>
          <li><a href="#lambda-monitor-req-ref-chai">chai</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="lambda-monitor-task-ref-structsrc-hangler">struct/src-hangler</a> (<a href="#lambda-monitor-task-idx-ref-structsrc-hangler">`index`</a>)

_Updating <a href="#lambda-monitor-target-ref-srchanglerjs">src/hangler.js</a> using <a href="#lambda-monitor-strat-ref-overwrite">overwrite</a>._

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
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-srchanglerjs">hangler.js</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-javascript">javascript</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="lambda-monitor-task-ref-structhowto">struct/howto</a> (<a href="#lambda-monitor-task-idx-ref-structhowto">`index`</a>)

_Updating <a href="#lambda-monitor-target-ref-howtomd">HOWTO.md</a> using <a href="#lambda-monitor-strat-ref-overwrite">overwrite</a>._

- Define setup file detailing how to set-up monitoring project.

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
<code>└─&nbsp;<a href="#lambda-monitor-target-ref-howtomd">HOWTO.md</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-javascript">javascript</a></li>
          <li><a href="#lambda-monitor-req-ref-chai">chai</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-var-ref-awsregion">awsRegion</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## :open_file_folder: <a name="lambda-monitor-task-ref-serverlessdefault">serverless/#default</a> (<a href="#lambda-monitor-task-idx-ref-serverlessdefault">`index`</a>)

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
<code>&nbsp;&nbsp;&nbsp;├─&nbsp;<a href="#lambda-monitor-target-ref-serverlessapiyml">api.yml</a></code><br/>
<code>&nbsp;&nbsp;&nbsp;├─&nbsp;<a href="#lambda-monitor-target-ref-serverlessdatayml">data.yml</a></code><br/>
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;api</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-serverlessapiconfigyml">config.yml</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-serverless">serverless</a></li>
          <li><a href="#lambda-monitor-req-ref-aws">aws</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-var-ref-enablecloudtrail">enableCloudTrail</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="lambda-monitor-task-ref-serverlessserverless-data">serverless/serverless-data</a> (<a href="#lambda-monitor-task-idx-ref-serverlessserverless-data">`index`</a>)

_Updating <a href="#lambda-monitor-target-ref-serverlessdatayml">serverless/data.yml</a> using <a href="#lambda-monitor-strat-ref-overwrite">overwrite</a>._

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
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-serverlessdatayml">data.yml</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-serverless">serverless</a></li>
          <li><a href="#lambda-monitor-req-ref-aws">aws</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="lambda-monitor-task-ref-serverlessserverless-api-config">serverless/serverless-api-config</a> (<a href="#lambda-monitor-task-idx-ref-serverlessserverless-api-config">`index`</a>)

_Updating <a href="#lambda-monitor-target-ref-serverlessapiconfigyml">serverless/api/config.yml</a> using <a href="#lambda-monitor-strat-ref-create-only">create-only</a>._

- Define api stack custom definition file.

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
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;api</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-serverlessapiconfigyml">config.yml</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-serverless">serverless</a></li>
          <li><a href="#lambda-monitor-req-ref-aws">aws</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### :clipboard: <a name="lambda-monitor-task-ref-serverlessserverless-api">serverless/serverless-api</a> (<a href="#lambda-monitor-task-idx-ref-serverlessserverless-api">`index`</a>)

_Updating <a href="#lambda-monitor-target-ref-serverlessapiyml">serverless/api.yml</a> using <a href="#lambda-monitor-strat-ref-overwrite">overwrite</a>._

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
<code>&nbsp;&nbsp;&nbsp;└─&nbsp;<a href="#lambda-monitor-target-ref-serverlessapiyml">api.yml</a></code><br/>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-req-ref-serverless">serverless</a></li>
          <li><a href="#lambda-monitor-req-ref-aws">aws</a></li>
        </ul>
      </td>
      <td align="left" valign="top">
        <ul>
          <li><a href="#lambda-monitor-var-ref-enablecloudtrail">enableCloudTrail</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

------

## Requires

### <a name="lambda-monitor-req-ref-javascript">javascript</a> ([`link`](https://en.wikipedia.org/wiki/JavaScript)) 

*Programming Language.*

JavaScript, often abbreviated as JS, is a high-level, interpreted programming language that conforms to the ECMAScript specification.
It is characterized as dynamic, weakly typed, prototype-based and multi-paradigm.

### <a name="lambda-monitor-req-ref-chai">chai</a> ([`link`](https://www.chaijs.com/)) 

*JavaScript assertion library.*

Chai is a BDD / TDD assertion library for node and the browser that can be paired with any javascript testing framework.

### <a name="lambda-monitor-req-ref-serverless">serverless</a> ([`link`](https://serverless.com/)) 

*Serverless Framework.*

The Serverless Framework is a free and open-source web framework that was 
developed for building serverless applications.

### <a name="lambda-monitor-req-ref-aws">aws</a> ([`link`](https://aws.amazon.com/)) 

*Amazon Web Services.*

Amazon Web Services (AWS) is a subsidiary of Amazon that provides on-demand cloud 
computing platforms to individuals, companies and governments, on a metered pay-as-you-go basis.

------

## Variables

### <a name="lambda-monitor-var-ref-awsregion">awsRegion</a>  : `string`

*Aws data center region code gets deployed to.*

List of available regions can be found [here](https://docs.aws.amazon.com/general/latest/gr/rande.html).

### <a name="lambda-monitor-var-ref-enablecloudtrail">enableCloudTrail</a>  : `string`

*Whether or not to enable CloudTrail.*

Should only be enabled if cloud trail logging is not already enabled on this aws account. Otherwise significant costs can occur. Set to either "true" or "false".

------

## Targets

### <a name="lambda-monitor-target-ref-testhanglerspecjs">test/hangler.spec.js</a>  

:small_red_triangle: <a href="#lambda-monitor-req-ref-javascript">javascript</a>

:small_blue_diamond: `other`

*Main project test file.*

Contains basic testing of code functionality for monitoring.

### <a name="lambda-monitor-target-ref-srchanglerjs">src/hangler.js</a>  

:small_red_triangle: <a href="#lambda-monitor-req-ref-javascript">javascript</a>

:small_blue_diamond: `other`

*Main project file.*

Contains code functionality for monitoring.

### <a name="lambda-monitor-target-ref-howtomd">HOWTO.md</a>  

:small_blue_diamond: `other`

*File describing how to setup project.*

Contains basic instructions on how to set up monitoring project.

### <a name="lambda-monitor-target-ref-serverlessdatayml">serverless/data.yml</a>  

:small_red_triangle: <a href="#lambda-monitor-req-ref-serverless">serverless</a>, <a href="#lambda-monitor-req-ref-javascript">javascript</a>

:small_blue_diamond: `yml`

*Data stack resource definition.*

Contains monitoring data stack resource definitions.

### <a name="lambda-monitor-target-ref-serverlessapiconfigyml">serverless/api/config.yml</a>  

:small_red_triangle: <a href="#lambda-monitor-req-ref-serverless">serverless</a>, <a href="#lambda-monitor-req-ref-javascript">javascript</a>

:small_blue_diamond: `yml`

*Api stack custom config definition.*

Contains monitoring api stack custom definitions.

### <a name="lambda-monitor-target-ref-serverlessapiyml">serverless/api.yml</a>  

:small_red_triangle: <a href="#lambda-monitor-req-ref-serverless">serverless</a>, <a href="#lambda-monitor-req-ref-javascript">javascript</a>

:small_blue_diamond: `yml`

*Api stack resource definition.*

Contains monitoring api stack resource definitions.

------

## Strategies

### <a name="lambda-monitor-strat-ref-overwrite">overwrite</a>  

:small_blue_diamond: `any`

*Simply replace the old with the new content.*

### <a name="lambda-monitor-strat-ref-create-only">create-only</a>  

:small_blue_diamond: `any`

*Does nothing when the file is already present, otherwise creates it.*

