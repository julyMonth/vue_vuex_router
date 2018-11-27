<template>
  <div id="mapConfig"
       class="mapConfig"
       @click="handleWindowClick"
  >
    <div class="leftTree">
      <div class="leftTitle">地图管理</div>
      <div class="leftContent">
        <div class="btnContent">
          <el-button type="iconButton" icon="h-icon-plus" @click="addMap"></el-button>
          <el-button type="iconButton" icon="h-icon-edit" @click="editMap"></el-button>
          <el-button type="iconButton" icon="h-icon-trashcan" @click="deleteMap"></el-button>
        </div>
        <div class="treeContent">
          <el-tree ref="tree"
                   :data="mapConfigTree"
                   :props="defaultProps"
                   node-key="id"
                   @node-click="handleMapNodeClick"
                   default-icon="h-icon-internet"
          ></el-tree>
        </div>
      </div>
    </div>
    <div class="rightWrapper">
      <div class="rightContent">
        <div class="rightHeader">
          <div class="rightTitle">当前地图：{{currentLocation}}</div>
          <el-button type="iconButton" icon="h-icon-gear" @click="$router.push({path: '/advancedConfig'})">高级设置
          </el-button>
        </div>
        <div class="mapWrapper">
          <div id="hgismap" class="mapContent"></div>
          <div class="searchContent" @click="handleShowSearchContent">
            <input type="text"
                   class="searchInput"
                   v-model="search.key"
            />
            <div class="searchResultContent" v-show="searchResultShow">
              <div class="searchResultHeader">
                <span class="searchResultType"
                      v-for="(item, key) of searchResult"
                      :class="{active: key === searchType}"
                      @click="searchType = key"
                >
                  {{item.text}}（{{item.num}}）
                </span>
              </div>
              <ul class="searchResultList">
                <li class="searchResultItem"
                    v-for="item in searchResultList"
                >
                  {{item.name}}
                </li>
              </ul>
            </div>
          </div>
          <div class="btnContent">
            <div class="btn" @click="addArea">
              <i class="icon-addArea"></i>
              <span>添加区域</span>
            </div>
            <div class="btn" @click="addMonitory">
              <i class="icon-addMonitory"></i>
              <span>添加监控点</span>
            </div>
            <div class="btn" @click="addRail">
              <i class="icon-addRail"></i>
              <span>添加电子围栏</span>
            </div>
          </div>
          <div class="zoomBar" v-show="showZoomBar">
            <span class="zoomblock homeIcon" @click="zoom(0)"></span>
            <span class="zoomblock" @click="zoom(1)">+</span>
            <span class="zoomblock" @click="zoom(2)">−</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :area="428"
               class="addMapContent"
               top="middle"
               :title="mapDialogTitle"
               :close-on-click-modal=false
               :close-on-press-escape=false
               :visible.sync="mapDialogVisible">
      <el-form :model="mapForm" label-width="100px" ref="mapDialogForm" :rules="rules">
        <el-form-item label="地图名称" required prop="mapName">
          <el-input v-model="mapForm.mapName" placeholder="请输入地图名称"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" required>
          <div class="file-upload-content">
            <el-input class="picNameContent" v-model="mapForm.picName" readonly></el-input>
            <a class="chooseMapBtn">
              浏览
              <input ref="fileInput"
                     class="fileInput"
                     type="file"
                     @change="picChange"
                     :key="fileInputKey"
              />
            </a>
          </div>
          <div class="mapTips">支持导入5M以内的jpg、png、bmp文件</div>
        </el-form-item>
        <template v-if="makerCode === '1002'">
          <el-form-item label="地图关键值" required prop="rvMapInfo.mapKey" :rules="rules.mapKey">
            <el-input v-model="mapForm.rvMapInfo.mapKey" placeholder="请输入地图关键值"></el-input>
          </el-form-item>
          <el-form-item label="X轴" required prop="rvMapInfo.centerX" :rules="rules.centerX">
            <el-input v-model.number="mapForm.rvMapInfo.centerX" maxlength="6" placeholder="请输入x轴"></el-input>
          </el-form-item>
          <el-form-item label="Y轴" required prop="rvMapInfo.centerY" :rules="rules.centerY">
            <el-input v-model.number="mapForm.rvMapInfo.centerY" maxlength="6" placeholder="请输入y轴"></el-input>
          </el-form-item>
          <el-form-item label="X坐标比例" required prop="rvMapInfo.proportionX" :rules="rules.proportionX">
            <el-input v-model.number="mapForm.rvMapInfo.proportionX" maxlength="6" placeholder="请输入X坐标比例"></el-input>
          </el-form-item>
          <el-form-item label="Y坐标比例" required prop="rvMapInfo.proportionY" :rules="rules.proportionY">
            <el-input v-model.number="mapForm.rvMapInfo.proportionY" maxlength="6" placeholder="请输入Y坐标比例"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddMapForm">确 定</el-button>
        <el-button @click="mapDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :area="600"
               top="middle"
               class="chooseMonitoryDialog"
               title="选择监控点"
               :close-on-click-modal=false
               :close-on-press-escape=false
               :visible.sync="monitoryDialogVisible">
      <div class="tableWrapper">
        <div class="header">
          <el-row>
            <el-col :span="3">
              <span class="searchMonitoryLabel">监控点名称</span>
            </el-col>
            <el-col :span="9">
              <el-input v-model="searchMonitoryKey" placeholder="搜索"></el-input>
            </el-col>
            <el-col :span="4" style="height: 32px"></el-col>
            <el-col :span="8" style="text-align: right">
              <el-button class="searchMonitoryBtn" type="primary" @click="getMonitoryTable(1)">查询</el-button>
              <el-button class="searchMonitoryBtn" @click="resetMonitory">重置</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="content">
          <el-table
            ref="monitoryTable"
            :data="monitoryTable"
            force-scroll
            highlight-current-row
            @current-change="handleMonitoryTableClick"
            style="width: 100%;">
            <el-table-column
              type="index"
              label="序号"
              width="10%">
            </el-table-column>
            <el-table-column
              prop="name"
              label="监控点名称"
              width="30%">
            </el-table-column>
            <el-table-column
              prop="channelNo"
              label="通道号"
              width="30%">
            </el-table-column>
            <el-table-column
              prop="indexCode"
              label="编号"
              width="30%">
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNo"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, huiPager, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMonitory">确 定</el-button>
        <el-button @click="monitoryDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import cameraImg from '../../../static/images/Monitor_hover.png'

  const HGIS = window.HGIS

  function convertBase64UrlToBlob (urlData) {
    var bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }

    return new Blob([ab], {type: 'image/png'})
  }

  let map = null,
    // 矢量图层，用于存放区域和电子围栏
    vectorLayer = {
      area: new HGIS.Layer.Vector('areaVector'),
      rail: new HGIS.Layer.Vector('railVector')
    },
    // 标记图层，用于存放监控点
    markersLayer = {
      monitory: new HGIS.Layer.Markers('markersLayer')
    },
    // 区域选择控件
    areaSelectFeature,
    // 添加区域弹框
    addAreaDialog,
    // 展示区域信息弹框
    areaInfoDialog,
    // 电子围栏选择控件
    railSelectFeature,
    // 添加电子围栏弹框
    addRailDialog,
    // 展示电子围栏信息弹框
    railInfoDialog,
    // 添加监控点弹框
    addMonitoryDialog,
    // 展示监控点信息弹框
    monitoryInfoDialog

  let size = new HGIS.Size(30, 30)
  // Marker相对于添加坐标点的偏移量 像素单位
  let offset = new HGIS.Pixel(-(size.w / 2), -(size.h / 2))
  // marker使用的ico图标
  let icon = new HGIS.Icon(cameraImg, size, offset)
  let markerMap = {}

  export default {
    name: 'index',
    data () {
      return {
        // 定位系统是否已经配置
        locationSystemIsConfig: false,
        // 地图表单key值，实现每次重复加载dom
        fileInputKey: '',
        mapId: '',
        mapConfigTree: [],
        defaultProps: {
          label: 'label',
          icon: 'icon'
        },
        // 是否显示控制按钮
        showZoomBar: false,
        // 生产厂家
        makerCode: '',
        currentLocation: '',
        search: '',
        searchType: 'total',
        searchResultShow: false,
        searchResult: {
          total: {
            text: '全部资源',
            num: 12
          },
          area: {
            text: '区域',
            num: 13
          },
          monitory: {
            text: '监控点',
            num: 13
          },
          rail: {
            text: '电子围栏',
            num: 13
          },
          station: {
            text: '基站',
            num: 3
          }
        },
        searchResultList: [
          {
            icon: '',
            name: '区域'
          }, {
            icon: '',
            name: '监控点'
          }, {
            icon: '',
            name: '电子围栏'
          }, {
            icon: '',
            name: '基站'
          }
        ],
        // 监控点弹框
        monitoryDialogVisible: false,
        // 添加区域弹框测试
        mapDialogVisible: false,
        // 地图图片对象
        picInfoObject: {},
        mapDialogTitle: '添加地图',
        mapForm: {
          mapName: '',
          mapFile: '',
          rvMapInfo: {
            mapKey: '',
            centerX: '',
            centerY: '',
            proportionX: '',
            proportionY: ''
          },
          picName: ''
        },
        floorConfig: {},
        placeConfig: {},
        // 区域集合
        areas: [],
        // 区域展示信息标题
        areaInfoDialogTitle: '',
        // 区域位置
        areaLocationObject: {
          mapPoint: '',
          centerPoint: ''
        },
        // 区域ID
        areaId: '',
        // 监控点表格
        monitoryTable: [],
        pagination: {
          pageSize: 10,
          pageNo: 1,
          total: 0
        },
        // 搜索监控点
        searchMonitoryKey: '',
        monitoryTableForm: {
          id: '',
          name: '',
          indexCode: '',
          deviceIndexCode: '',
          channelNum: ''
        },
        // 临时监控点表单
        temporaryMonitoryTableForm: {
          id: '',
          name: '',
          indexCode: '',
          deviceIndexCode: '',
          channelNum: ''
        },
        // 电子围栏集合
        rails: [],
        // 电子围栏展示信息标题
        railInfoDialogTitle: '',
        // 电子围栏位置
        railLocationObject: {
          mapPoint: '',
          centerPoint: ''
        },
        // 电子围栏ID
        railId: '',
        // 监控点
        monitoryList: [],
        monitoryInfoDialogTitle: '',
        monitoryLocationObject: {
          centerPointStr: ''
        },
        monitoryId: '',
        // 表单验证
        rules: {
          mapName: [
            {required: true, message: '地图名称不能为空'},
            {max: 32, message: '地图名称不应超过32个字符'},
            {
              validator: (rule, value, callback) => {
                if (/[\\/:*?"<|'%>&+]/.test(value)) {
                  callback(new Error('不允许包含特殊字符\\/:*?"<|\'%>&+'))
                } else if (value.match(/^\s+$/)) {
                  callback(new Error('地图名称不允许为空格'))
                } else {
                  callback()
                }
              }
            }
          ],
          mapKey: [
            {required: true, message: '地图关键值不能为空'},
            {max: 32, message: '地图名称不应超过32个字符'},
            {
              validator: (rule, value, callback) => {
                if (/[\\/:*?"<|'%>&+]/.test(value)) {
                  callback(new Error('不允许包含特殊字符\\/:*?"<|\'%>&+'))
                } else if (value.match(/^\s+$/)) {
                  callback(new Error('地图关键值不允许为空格'))
                } else {
                  callback()
                }
              }
            }
          ],
          centerX: [
            {required: true, message: 'X轴不能为空'},
            {type: 'number', message: 'X轴必须为数字值'},
            {
              validator: (rule, value, callback) => {
                if (value > 100000) {
                  callback(new Error('X轴不能大于100000'))
                } else {
                  callback()
                }
              }
            }
          ],
          centerY: [
            {required: true, message: 'Y轴不能为空'},
            {type: 'number', message: 'Y轴必须为数字值'},
            {
              validator: (rule, value, callback) => {
                if (value > 100000) {
                  callback(new Error('Y轴不能大于100000'))
                } else {
                  callback()
                }
              }
            }
          ],
          proportionX: [
            {required: true, message: 'X坐标比例不能为空'},
            {type: 'number', message: 'X坐标比例必须为数字值'},
            {
              validator: (rule, value, callback) => {
                if (value > 100000) {
                  callback(new Error('X坐标比例不能大于100000'))
                } else {
                  callback()
                }
              }
            }
          ],
          proportionY: [
            {required: true, message: 'Y坐标比例不能为空'},
            {type: 'number', message: 'Y坐标比例必须为数字值'},
            {
              validator: (rule, value, callback) => {
                if (value > 100000) {
                  callback(new Error('Y坐标比例不能大于100000'))
                } else {
                  callback()
                }
              }
            }
          ]
        }
      }
    },
    methods: {
      // 获取定位系统数据
      getLocationSystem () {
        this.$http.post('/rfidSystem/load', {}).then((res) => {
          this.makerCode = res.data.data.makerCode
          if (this.makerCode) {
            this.locationSystemIsConfig = true
          } else {
            this.$message.info('请先配置定位系统！')
          }
        })
      },
      // 获取地图树
      getMapTree () {
        this.$http.post('/map/getAllMaps', {}).then((res) => {
          if (res.data.code === '0') {
            this.getLocationSystem()
            this.mapConfigTree = res.data.data
            if (this.mapConfigTree.length) {
              this.mapId = this.mapConfigTree[0].id
              this.currentLocation = this.mapConfigTree[0].label
              this.$nextTick(() => {
                this.$refs.tree.setCurrentNode(this.mapConfigTree[0])
              })
              this.getmapconfig(this.mapConfigTree[0])
              this.showZoomBar = true
            } else {
              if (map) {
                map.destroy()
                this.showZoomBar = false
                this.currentLocation = ''
              }
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 获取地图配置
      getmapconfig (data) {
        let {placeId, floorId} = data
        this.$http.post(`/map/getFloorByPlaceIdAndFloorId`, {placeId, floorId}).then((res) => {
          if (res.data.code === '0') {
            this.initMap(res.data.data)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 初始化地图
      initMap (_placeConfig) {
        const that = this
        if (map) {
          map.destroy()
        }
        this.addTMSMap(_placeConfig)
        const mapOption = {
          // 地图加载完成事件
          mapLoaded () {
            vectorLayer = {
              area: new HGIS.Layer.Vector('areaVector'),
              rail: new HGIS.Layer.Vector('railVector')
            }
            // 标记图层，用于存放监控点
            markersLayer = {
              monitory: new HGIS.Layer.Markers('markersLayer')
            }
            // 加载图层
            map.addLayer(vectorLayer.area)
            map.addLayer(vectorLayer.rail)
            map.addLayer(markersLayer.monitory)
            that.getAllMapResource(true)
          }
        }
        map = new HGIS.MapEx('hgismap', mapOption)
      },
      // 根据返回值配置地图参数
      addTMSMap (_placeConfig) {
        // 表示采用前端配置的方式显示地图,默认为false,即通过后端配置加载地图
        HGIS.InitParam.isFrontConfig = true
        let initLevel = 17
        let maxLevel = 17
        let minLevel = 1
        let levels = _placeConfig.floorsInfo[0].levels
        if (levels.length) {
          maxLevel = levels[levels.length - 1]
          minLevel = levels[0]
          initLevel = Math.floor((maxLevel + minLevel) / 2)
        }
        HGIS.InitParam.initLevel = initLevel
        window.initLevel = initLevel
        HGIS.InitParam.maxLevel = maxLevel
        HGIS.InitParam.minLevel = minLevel
        HGIS.InitParam.srid = _placeConfig.srid
        HGIS.InitParam.mapType = 'tmsmap'
        // 地图中心
        HGIS.InitParam.center = new HGIS.LonLat(_placeConfig.xy[0], _placeConfig.xy[1])
        window.center = new HGIS.LonLat(_placeConfig.xy[0], _placeConfig.xy[1])
        // 初始化地图图像加载格式
        HGIS.InitParam.imageFormat = 'png'
        // 地图切片大小
        HGIS.InitParam.tileSize = '256'
        HGIS.InitParam.tileOrigin = new HGIS.LonLat(_placeConfig.floorsInfo[0].origin[0], _placeConfig.floorsInfo[0].origin[1])
        // 分辨率
        HGIS.InitParam.resolutions = _placeConfig.floorsInfo[0].resolutions
        // 矢量地图加载链接
        HGIS.InitParam.vecUrl = '/vrc/indoor/' + `${_placeConfig.floorsInfo[0].placeId}/${_placeConfig.floorsInfo[0].floorId}` + '/{z}/{x}/{y}.png'
        if (_placeConfig.srid === '4326') {
          HGIS.InitParam.extent = new HGIS.Bounds(-180, -90, 180, 90)
          HGIS.InitParam.mapUnit = 'degree'
        } else if (_placeConfig.srid === '900913') {
          HGIS.InitParam.extent = new HGIS.Bounds(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892)
          HGIS.InitParam.mapUnit = 'm'
        }
      },
      // 获取地图资源——区域与电子围栏
      getAllMapResource (bool) {
        // this.$http.post(`/map/${this.mapId}/resources`, {}).then((res) => {
        //   if (res.data.code === '0') {
        //     // 清空地图资源
        //     vectorLayer.area.removeAllFeatures()
        //     vectorLayer.rail.removeAllFeatures()
        //     this.areas = res.data.data.area
        //     this.rails = res.data.data.electronicFence
        //     this.areas.map((item) => {
        //       this.drawAreaResource(item)
        //     })
        //     this.rails.map((item) => {
        //       this.drawRailResource(item)
        //     })
        //     // 加载完地图后，添加矢量对象选择控件
        //     this.addSelectControl()
        //   } else {
        //     this.$message.error(res.data.msg)
        //   }
        // })
        this.$http.all([this.$http.post(`/map/${this.mapId}/resources`, {}), this.$http.post(`/map/camera/query/${this.mapId}`, {})]).then(this.$http.spread((vecRes, markerRes) => {
          if (vecRes.data.code === '0' && markerRes.data.code === '0') {
            // 清空地图资源
            vectorLayer.area.removeAllFeatures()
            vectorLayer.rail.removeAllFeatures()
            markersLayer.monitory.clearMarkers()
            this.areas = vecRes.data.data.area
            this.rails = vecRes.data.data.electronicFence
            this.monitoryList = markerRes.data.data
            this.areas.map((item) => {
              this.drawAreaResource(item)
            })
            this.rails.map((item) => {
              this.drawRailResource(item)
            })
            this.monitoryList.map((item) => {
              this.drawMonitoryResource(item)
            })
            // 添加矢量对象选择控件
            if (bool) {
              this.addSelectControl()
            }
          }
        })).catch()
      },
      // 根据返回的区域信息绘制区域
      drawAreaResource (item) {
        // 面样式
        let polygonStyle = {
          fill: true,
          fillColor: '#8ef4f4',
          fillOpacity: 0.3,
          strokeColor: '#00acab'
        }
        let polygon = HGIS.Utils.wkt2Geom(item.mapPoint)
        let area = new HGIS.Feature.Vector(polygon, item, polygonStyle)
        vectorLayer.area.addFeatures(area)
      },
      // 根据返回的电子围栏信息绘制区域
      drawRailResource (item) {
        // 面样式
        let polygonStyle = {
          fill: false,
          strokeColor: '#fb5b61',
          strokeWidth: '5'
        }
        let polygon = HGIS.Utils.wkt2Geom(item.mapPointStr)
        let rail = new HGIS.Feature.Vector(polygon, item, polygonStyle)
        vectorLayer.rail.addFeatures(rail)
      },
      drawMonitoryResource (item) {
        let lonLat = new HGIS.LonLat(item.xAxis, item.yAxis)
        markerMap[item.id] = new HGIS.Marker(lonLat, icon.clone())
        // 绑定点击事件
        markerMap[item.id].events.register('click', markerMap[item.id], () => {
          this.showMonitoryInfoPopUp(item)
        })
        markersLayer.monitory.addMarker(markerMap[item.id])
      },
      // 添加矢量对象选择控件
      addSelectControl () {
        let that = this
        areaSelectFeature = new HGIS.Control.SelectFeature(vectorLayer.area, {
          clickout: true,
          hover: false,
          // 点击事件
          clickFeature (feature) {
            vectorLayer.area.drawFeature(feature)
            that.areaInfoDialogTitle = feature.data.name
            that.showAreaInfoPopUp(feature)
          }
        })
        railSelectFeature = new HGIS.Control.SelectFeature(vectorLayer.rail, {
          clickout: true,
          hover: false,
          // 点击事件
          clickFeature (feature) {
            vectorLayer.rail.drawFeature(feature)
            if (railInfoDialog) {
              railInfoDialog.hide()
            }
            that.railInfoDialogTitle = feature.data.name
            that.showRailInfoPopUp(feature)
          }
        })
        // map上添加控件
        map.addControl(areaSelectFeature)
        map.addControl(railSelectFeature)
        // 激活控件
        areaSelectFeature.activate()
        railSelectFeature.activate()
      },
      // 禁用对象选择控件
      removeSelectControl () {
        areaSelectFeature.deactivate()
        railSelectFeature.deactivate()
      },
      // 激活对象选择控件
      activeSelectControl () {
        areaSelectFeature.activate()
        railSelectFeature.activate()
      },
      // 树节点点击
      handleMapNodeClick (node) {
        this.mapId = node.id
        this.currentLocation = node.label
        this.getmapconfig(node)
      },
      // 添加地图
      addMap () {
        if (this.locationSystemIsConfig) {
          this.mapDialogTitle = '添加地图'
          this.mapDialogVisible = true
          this.$refs['mapDialogForm'] && this.$refs['mapDialogForm'].resetFields()
          // this.mapId = ''
          this.mapForm = {
            mapName: '',
            mapFile: '',
            rvMapInfo: {
              mapKey: '',
              centerX: '',
              centerY: '',
              proportionX: '',
              proportionY: ''
            },
            picName: ''
          }
          this.picInfoObject = {}
          this.$nextTick(() => {
            // 修改上传表单key值，强制更换dom（ie10无法修改表单值的bug）
            this.fileInputKey = new Date().valueOf()
            // 清空二进制流表单
            this.$refs.fileInput.value = ''
          })
        } else {
          this.$message('请先配置定位系统！')
        }
      },
      // 修改地图
      editMap () {
        if (this.mapId) {
          this.mapDialogTitle = '编辑地图'
          this.$http.post(`/map/load/${this.mapId}`, {}).then((res) => {
            if (res.data.code === '0') {
              let data = res.data.data
              this.mapForm = {
                mapName: data.name,
                mapFile: '',
                rvMapInfo: {
                  mapKey: data.rvMapInfo.mapKey,
                  centerX: data.rvMapInfo.centerX,
                  centerY: data.rvMapInfo.centerY,
                  proportionX: data.rvMapInfo.proportionX,
                  proportionY: data.rvMapInfo.proportionY
                },
                picName: data.pictureName
              }
              this.picInfoObject = {}
              this.mapDialogVisible = true
              this.$refs['mapDialogForm'] && this.$refs['mapDialogForm'].resetFields()
              this.$nextTick(() => {
                // 修改上传表单key值，强制更换dom（ie10无法修改表单值的bug）
                this.fileInputKey = new Date().valueOf()
                // 清空二进制流表单
                this.$refs.fileInput.value = ''
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          this.$message.error('请先选择地图！')
        }
      },
      // 删除地图
      deleteMap () {
        if (this.mapId) {
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'question'
          }).then(() => {
            this.$http.post(`/map/delete/${this.mapId}`, {}).then((res) => {
              if (res.data.code === '0') {
                this.getMapTree()
                this.$message.success('删除地图成功！')
              } else {
                this.$message.error(res.data.msg)
              }
            })
          })
        } else {
          this.$message.error('请先选择地图！')
        }
      },
      // 提交添加地图表单
      submitAddMapForm () {
        if (!this.mapForm.picName) {
          this.$message({
            message: '请上传图片！',
            type: 'error'
          })
          return
        }
        this.$refs['mapDialogForm'].validate((valid) => {
          if (valid) {
            let formData = new FormData()
            if (this.mapId) {
              formData.append('id', this.mapDialogTitle === '编辑地图' ? this.mapId : '')
            }
            formData.append('mapName', this.mapForm.mapName)
            if (this.mapForm.mapFile) {
              formData.append('mapFile', this.mapForm.mapFile, this.mapForm.picName)
            }
            formData.append('pictureName', this.mapForm.picName)
            formData.append('rvMapInfo', JSON.stringify(this.mapForm.rvMapInfo))
            // 组建XMLHttpRequest 上传文件
            let xhr = new XMLHttpRequest()
            // 确认修改还是新增
            let targetUrl = this.mapDialogTitle === '编辑地图' ? '/vrc/map/update' : '/vrc/map/save'
            xhr.open('post', targetUrl)
            xhr.send(formData)
            let loadingInstance = this.$loading({fullscreen: true, text: '正在保存地图...'})
            xhr.onreadystatechange = () => {
              loadingInstance.close()
              if (xhr.readyState === 4 && xhr.status === 200) {
                let res = JSON.parse(xhr.responseText)
                if (res.code === '0') {
                  this.mapDialogVisible = false
                  this.getMapTree()
                  this.$message.success('上传地图成功！')
                } else {
                  this.$message.error(res.msg)
                }
              }
              setTimeout(() => {
                loadingInstance.close()
              }, 500)
            }
          }
        })
      },
      // 切换图片
      picChange (e) {
        let picFileInfo = e.target.files[0]
        if (picFileInfo.size > 1024 * 1024 * 5) {
          this.fileInputKey = new Date().valueOf()
          this.$refs.fileInput.value = ''
          return this.$message.error('请导入5M以内的图片！')
        }
        if (!picFileInfo.name.split('.')[picFileInfo.name.split('.').length - 1].match(/jpg|png|bmp/)) {
          this.fileInputKey = new Date().valueOf()
          this.$refs.fileInput.value = ''
          return this.$message.error('图片类型仅限jpg、png、bmp！')
        }
        let reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
          this.mapForm.mapFile = convertBase64UrlToBlob(reader.result)
          this.mapForm.picName = e.target.files[0].name
        }
        this.picInfoObject = e.target.files[0]
      },
      // 显示搜索区域
      handleShowSearchContent (e) {
        if (!this.searchResultShow) {
          this.searchResultShow = true
        }
        e.stopPropagation()
      },
      // 点击其他区域隐藏搜索区域
      handleWindowClick () {
        this.searchResultShow = false
      },
      // 显示区域信息弹框
      showAreaInfoPopUp (feature) {
        window.areaId = feature.data.areaId
        window.areaInfo = feature
        // 内容框的大小
        let contentSize = new HGIS.Size(328, 256)
        let titleHTML = ''
        let contentHTML = `
          <div class="areaInfoDialog">
            <div class="el-dialog__header">
              <span class="el-dialog__title" title="${this.areaInfoDialogTitle}">${this.areaInfoDialogTitle}</span>
              <button type="button" title="关闭" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'closeAreaInfoDia'});">
                <i class="el-dialog__close el-icon h-icon-close"></i>
              </button>
              <button type="button" title="删除区域" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'deleteArea', payload: window.areaId});">
                <i class="el-dialog__close el-icon h-icon-trashcan"></i>
              </button>
              <button type="button" title="更新位置" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'updateAreaLocation', payload: window.areaId});">
                <i class="el-dialog__close el-icon h-icon-crop"></i>
              </button>
              <button type="button" title="编辑信息" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'editArea', payload: window.areaInfo});">
                <i class="el-dialog__close el-icon h-icon-edit"></i>
              </button>
            </div>
            <div class="el-dialog__body">
              <div class="el-dialog__body-wrapper">
                <form class="el-form">
                  <div class="el-form-item">
                    <label class="el-form-item__label" style="width: 100px;">区域编号：</label>
                    <div class="el-form-item__content" style="margin-left: 100px;">
                      <span class="dialog-span" title="${feature.data.indexCode}">${feature.data.indexCode}</span>
                    </div>
                  </div>
                  <div class="el-form-item">
                    <label class="el-form-item__label" style="width: 100px;">关联监控点：</label>
                    <div class="el-form-item__content" style="margin-left: 100px;">
                      <span class="dialog-span" title="${feature.data.areaCamera.name}">${feature.data.areaCamera.name}</span>
                    </div>
                  </div>
                  <div class="el-form-item">
                    <label class="el-form-item__label" style="width: 100px;">区域延时：</label>
                    <div class="el-form-item__content" style="margin-left: 100px;">
                      <span class="dialog-span" title="${feature.data.delay}">${feature.data.delay}</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>`
        // 弹框内容
        let anchor = {
          size: new HGIS.Size(0, 0),
          offset: new HGIS.Pixel(0, 0)
        }
        let closeBox = false
        let geometry = feature.geometry
        let lonlat = {
          lon: (geometry.bounds.right + geometry.bounds.left) / 2,
          lat: (geometry.bounds.top + geometry.bounds.bottom) / 2
        }
        let id = 'areaInfoDialog'
        // 声明信息弹出框
        areaInfoDialog = new HGIS.Popup.InfoWindow(id, lonlat,
          contentSize, titleHTML, contentHTML, anchor, closeBox, null)
        // 弹框添加到地图上
        map.addPopup(areaInfoDialog, true)
        areaInfoDialog.show()
        lonlat = new HGIS.LonLat(lonlat.lon, lonlat.lat)
        map.panTo(lonlat)
      },
      // 显示监控点信息弹框
      showMonitoryInfoPopUp (feature) {
        window.monitoryId = feature.id
        window.monitoryInfo = feature
        // 内容框的大小
        let contentSize = new HGIS.Size(328, 40)
        let titleHTML = ''
        let contentHTML = `
          <div class="areaInfoDialog">
            <div class="el-dialog__header" style="border-bottom: 0">
              <span class="el-dialog__title" title="${feature.name}">${feature.name}</span>
              <button type="button" title="关闭" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'closeMonitoryInfoDia'});">
                <i class="el-dialog__close el-icon h-icon-close"></i>
              </button>
              <button type="button" title="删除监控点" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'deleteMonitory', payload: window.monitoryId});">
                <i class="el-dialog__close el-icon h-icon-trashcan"></i>
              </button>
              <button type="button" title="更新位置" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'updateMonitoryLocation', payload: window.monitoryId});">
                <i class="el-dialog__close el-icon h-icon-crop"></i>
              </button>
              <button type="button" title="编辑信息" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'editMonitory', payload: window.monitoryInfo});">
                <i class="el-dialog__close el-icon h-icon-edit"></i>
              </button>
            </div>
          </div>`
        // 弹框内容
        let anchor = {
          size: new HGIS.Size(0, 0),
          offset: new HGIS.Pixel(0, 0)
        }
        let closeBox = false
        let lonlat = {
          lon: feature.xAxis,
          lat: feature.yAxis
        }
        let id = 'areaInfoDialog'
        // 声明信息弹出框
        monitoryInfoDialog = new HGIS.Popup.InfoWindow(id, lonlat,
          contentSize, titleHTML, contentHTML, anchor, closeBox, null)
        // 弹框添加到地图上
        map.addPopup(monitoryInfoDialog, true)
        monitoryInfoDialog.show()
        lonlat = new HGIS.LonLat(lonlat.lon, lonlat.lat)
        map.panTo(lonlat)
      },
      // 显示电子围栏信息弹框
      showRailInfoPopUp (feature) {
        window.railId = feature.data.id
        window.railInfo = feature
        // 内容框的大小
        let contentSize = new HGIS.Size(328, 40)
        let titleHTML = ''
        let contentHTML = `
          <div class="areaInfoDialog">
            <div class="el-dialog__header" style="border-bottom: 0">
              <span class="el-dialog__title" title="${this.railInfoDialogTitle}">${this.railInfoDialogTitle}</span>
              <button type="button" title="关闭" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'closeRailInfoDia'});">
                <i class="el-dialog__close el-icon h-icon-close"></i>
              </button>
              <button type="button" title="删除电子围栏" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'deleteRail', payload: window.railId});">
                <i class="el-dialog__close el-icon h-icon-trashcan"></i>
              </button>
              <button type="button" title="更新位置" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'updateRailLocation', payload: window.railId});">
                <i class="el-dialog__close el-icon h-icon-crop"></i>
              </button>
              <button type="button" title="编辑信息" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'editRail', payload: window.railInfo});">
                <i class="el-dialog__close el-icon h-icon-edit"></i>
              </button>
            </div>
          </div>`
        // 弹框内容
        let anchor = {
          size: new HGIS.Size(0, 0),
          offset: new HGIS.Pixel(0, 0)
        }
        let closeBox = false
        let geometry = feature.geometry
        let lonlat = {
          lon: (geometry.bounds.right + geometry.bounds.left) / 2,
          lat: (geometry.bounds.top + geometry.bounds.bottom) / 2
        }
        let id = 'railInfoDialog'
        // 声明信息弹出框
        railInfoDialog = new HGIS.Popup.InfoWindow(id, lonlat,
          contentSize, titleHTML, contentHTML, anchor, closeBox, null)
        // 弹框添加到地图上
        map.addPopup(railInfoDialog, true)
        railInfoDialog.show()
        lonlat = new HGIS.LonLat(lonlat.lon, lonlat.lat)
        map.panTo(lonlat)
      },
      // 添加区域
      addArea () {
        // 初始化参数
        this.areaLocationObject.mapPoint = ''
        this.areaLocationObject.centerPoint = ''
        this.monitoryTableForm.id = ''
        this.monitoryTableForm.name = ''
        this.monitoryTableForm.indexCode = ''
        this.monitoryTableForm.deviceIndexcode = ''
        this.areaId = ''
        this.$message('请单击开始绘制区域，双击结束绘制，按ESC取消')
        map.draw('polygon', vectorLayer.area, 'geometry', '添加区域', {
          'keepOn': false,
          'ifClear': false
        }, this.testAddArea, null)
      },
      // 新增区域绘制检测
      testAddArea (geometry) {
        let params = {
          mapId: this.mapId,
          mapPoint: geometry.toString(),
          centerPoint: geometry.getCentroid().toString()
        }
        this.$http.post(`/map/area/checkIntersect`, params).then((res) => {
          if (res.data.code === '0') {
            this.showAddAreaPopUp(geometry)
          } else {
            this.getAllMapResource()
            this.$message.error(res.data.msg)
          }
        })
      },
      // 显示添加区域弹框
      showAddAreaPopUp (geometry, type) {
        this.areaLocationObject.mapPoint = geometry.toString()
        this.areaLocationObject.centerPoint = geometry.getCentroid().toString()
        let dialogTitle = type === 'edit' ? '修改区域' : '添加区域'
        // 添加、修改换不同的按钮
        let btnClickHtml
        if (type === 'edit') {
          btnClickHtml = `<button type="button" class="el-button el-button--primary" onclick="javascript:window.callJavascriptMethods({type:'updateAreaInfo'});">
                            <span>确 定</span>
                          </button>`
        } else {
          btnClickHtml = `<button type="button" class="el-button el-button--primary" onclick="javascript:window.callJavascriptMethods({type:'submitAddAreaForm'});">
                            <span>确 定</span>
                          </button>`
        }
        // 内容框的大小
        let contentSize = new HGIS.Size(428, 373)
        let titleHTML = ''
        let contentHTML = `
          <div class="addAreaDialog">
            <div class="el-dialog__header">
              <span class="el-dialog__title" title="${dialogTitle}">${dialogTitle}</span>
              <button type="button" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'closeAreaAddDia'});">
                <i class="el-dialog__close el-icon h-icon-close"></i>
              </button>
            </div>
            <div class="el-dialog__body">
              <div class="el-dialog__body-wrapper">
                <form class="el-form">
                  <div class="el-form-item is-required">
                    <label class="el-form-item__label" style="width: 90px;">区域名称</label>
                    <div class="el-form-item__content" style="margin-left: 90px;">
                      <div class="el-input">
                        <input id="areaName" autocomplete="off" placeholder="请输入区域名称" type="text" rows="2" validateevent="true" tipsplacement="top" tipsoffset="0" tipstrigger="focus" class="el-input__inner">
                      </div>
                    </div>
                  </div>
                  <div class="el-form-item is-required">
                    <label class="el-form-item__label" style="width: 90px;">区域编号</label>
                    <div class="el-form-item__content" style="margin-left: 90px;">
                      <div class="el-input">
                        <input id="areaIndexCode" autocomplete="off" placeholder="请输入区域编号" type="text" rows="2" validateevent="true" tipsplacement="top" tipsoffset="0" tipstrigger="focus" class="el-input__inner">
                      </div>
                    </div>
                  </div>
                  <div class="el-form-item is-required">
                    <label class="el-form-item__label" style="width: 90px;">关联监控点</label>
                    <div class="el-form-item__content" style="margin-left: 90px;">
                      <div class="monitoryPointName el-input">
                        <input id="monitoryName" autocomplete="off" placeholder="请选择监控点" readonly="readonly" type="text" rows="2" validateevent="true" tipsplacement="top" tipsoffset="0" tipstrigger="focus" class="el-input__inner">
                      </div>
                      <a class="chooseMonitoryBtn" onclick="javascript:window.callJavascriptMethods({type:'chooseMonitory'});">选择</a>
                    </div>
                  </div>
                  <div class="el-form-item">
                    <label class="el-form-item__label" style="width: 90px;">区域延时</label>
                    <div class="el-form-item__content" style="margin-left: 90px;">
                      <div class="el-input">
                        <input id="areaDelay" autocomplete="off" placeholder="请输入0-10的整数" type="text" rows="2" validateevent="true" tipsplacement="top" tipsoffset="0" tipstrigger="focus" class="el-input__inner">
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="el-dialog__footer">
              <div class="dialog-footer">
                ${btnClickHtml}
                <button type="button" class="el-button el-button--default" onclick="javascript:window.callJavascriptMethods({type:'closeAreaAddDia'});">
                  <span>取 消</span>
                </button>
              </div>
            </div>
          </div>`
        // 弹框内容
        let anchor = {
          size: new HGIS.Size(0, 0),
          offset: new HGIS.Pixel(0, 0)
        }
        let closeBox = false
        let lonlat = {
          lon: (geometry.bounds.right + geometry.bounds.left) / 2,
          lat: (geometry.bounds.top + geometry.bounds.bottom) / 2
        }
        let id = 'addAreaDialog'
        // 声明信息弹出框
        addAreaDialog = new HGIS.Popup.InfoWindow(id, lonlat,
          contentSize, titleHTML, contentHTML, anchor, closeBox, null)
        // 弹框添加到地图上
        map.addPopup(addAreaDialog, true)
        addAreaDialog.show()
        lonlat = new HGIS.LonLat(lonlat.lon, lonlat.lat)
        map.panTo(lonlat)
      },
      // 添加监控点
      addMonitory () {
        this.$message('请点击地图上的点以添加监控点，按ESC取消')
        // 绑定添加事件
        map.events.register('click', markersLayer.monitory, this.addMonitoryToMap)
        document.addEventListener('keydown', this.cancelAddMonitory)
        this.removeSelectControl()
      },
      // 按esc取消添加监控点
      cancelAddMonitory (e) {
        if (e.keyCode === 27) {
          this.unregisterMonitory()
          // 重新绑定选择控件
          this.activeSelectControl()
        }
      },
      // 添加监控点到地图
      addMonitoryToMap (e) {
        // 解除添加监控点的事件
        this.unregisterMonitory()
        let lonLat = map.getLonLatFromPixel(e.xy)
        let marker = new HGIS.Marker(lonLat, icon)
        markersLayer.monitory.addMarker(marker)
        this.showAddMonitoryPopUp(lonLat)
      },
      // 解除添加监控点鼠标事件
      unregisterMonitory () {
        map.events.unregister('click', markersLayer.monitory, this.addMonitoryToMap)
        // 同时移除esc事件
        document.removeEventListener('keydown', this.cancelAddMonitory)
      },
      // 显示添加监控点弹框
      showAddMonitoryPopUp (lonLat, type) {
        // 重新绑定控件
        this.activeSelectControl()
        this.monitoryLocationObject.centerPointStr = new HGIS.Geometry.Point(lonLat.lon, lonLat.lat).toString()
        let dialogTitle
        if (type === 'edit') {
          dialogTitle = '修改监控点'
        } else {
          dialogTitle = '添加监控点'
        }
        // 添加、修改换不同的按钮
        let btnClickHtml
        if (type === 'edit') {
          btnClickHtml = `<button type="button" class="el-button el-button--primary" onclick="javascript:window.callJavascriptMethods({type:'updateMonitoryInfo'});">
                            <span>确 定</span>
                          </button>`
        } else {
          btnClickHtml = `<button type="button" class="el-button el-button--primary" onclick="javascript:window.callJavascriptMethods({type:'submitAddMonitoryForm'});">
                            <span>确 定</span>
                          </button>`
        }
        // 内容框的大小
        let contentSize = new HGIS.Size(428, 211)
        let titleHTML = ''
        let contentHTML = `
          <div class="addAreaDialog">
            <div class="el-dialog__header">
              <span class="el-dialog__title" title="${dialogTitle}">${dialogTitle}</span>
              <button type="button" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'closeMonitoryAddDia'});">
                <i class="el-dialog__close el-icon h-icon-close"></i>
              </button>
            </div>
            <div class="el-dialog__body">
              <div class="el-dialog__body-wrapper">
                <div class="el-form-item is-required">
                  <label class="el-form-item__label" style="width: 100px;">关联监控点</label>
                  <div class="el-form-item__content" style="margin-left: 100px;">
                    <div class="monitoryPointName el-input">
                      <input id="monitoryName" autocomplete="off" placeholder="请选择监控点" readonly="readonly" type="text" rows="2" validateevent="true" tipsplacement="top" tipsoffset="0" tipstrigger="focus" class="el-input__inner">
                    </div>
                    <a class="chooseMonitoryBtn" onclick="javascript:window.callJavascriptMethods({type:'chooseMonitory'});">选择</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="el-dialog__footer">
              <div class="dialog-footer">
                ${btnClickHtml}
                <button type="button" class="el-button el-button--default" onclick="javascript:window.callJavascriptMethods({type:'closeMonitoryAddDia'});">
                  <span>取 消</span>
                </button>
              </div>
            </div>
          </div>`
        // 弹框内容
        let anchor = {
          size: new HGIS.Size(0, 0),
          offset: new HGIS.Pixel(0, 0)
        }
        let closeBox = false
        let id = 'addMonitoryDialog'
        // 声明信息弹出框
        addMonitoryDialog = new HGIS.Popup.InfoWindow(id, lonLat,
          contentSize, titleHTML, contentHTML, anchor, closeBox, null)
        // 弹框添加到地图上
        map.addPopup(addMonitoryDialog, true)
        addMonitoryDialog.show()
        let lonlat = new HGIS.LonLat(lonLat.lon, lonLat.lat)
        map.panTo(lonlat)
      },
      // 添加电子围栏
      addRail () {
        this.$message('请单击开始绘制电子围栏，双击结束绘制，按ESC取消')
        map.draw('polygon', vectorLayer.rail, 'geometry', '添加电子围栏', {
          'keepOn': false,
          'ifClear': false
        }, this.testAddRail, null)
      },
      // 新增电子围栏区域检测
      testAddRail (geometry) {
        let params = {
          mapId: this.mapId,
          mapPointStr: geometry.toString(),
          centerPointStr: geometry.getCentroid().toString()
        }
        this.$http.post(`/map/electronicFence/checkIntersection`, params).then((res) => {
          if (res.data.code === '0') {
            this.showAddRailPopUp(geometry)
          } else {
            this.getAllMapResource()
            this.$message.error(res.data.msg)
          }
        })
      },
      // 显示添加电子围栏弹框
      showAddRailPopUp (geometry, type) {
        this.railLocationObject.mapPoint = geometry.toString()
        this.railLocationObject.centerPoint = geometry.getCentroid().toString()
        let dialogTitle
        if (type === 'edit') {
          dialogTitle = '修改电子围栏'
        } else {
          dialogTitle = '添加电子围栏'
        }
        // 添加、修改换不同的按钮
        let btnClickHtml
        if (type === 'edit') {
          btnClickHtml = `<button type="button" class="el-button el-button--primary" onclick="javascript:window.callJavascriptMethods({type:'updateRailInfo'});">
                            <span>确 定</span>
                          </button>`
        } else {
          btnClickHtml = `<button type="button" class="el-button el-button--primary" onclick="javascript:window.callJavascriptMethods({type:'submitAddRailForm'});">
                            <span>确 定</span>
                          </button>`
        }
        // 内容框的大小
        let contentSize = new HGIS.Size(428, 210)
        let titleHTML = ''
        let contentHTML = `
          <div class="addRailDialog">
            <div class="el-dialog__header">
              <span class="el-dialog__title" title="${dialogTitle}">${dialogTitle}</span>
              <button type="button" aria-label="Close" class="el-dialog__headerbtn" onclick="javascript:window.callJavascriptMethods({type:'closeRailAddDia'});">
                <i class="el-dialog__close el-icon h-icon-close"></i>
              </button>
            </div>
            <div class="el-dialog__body">
              <div class="el-dialog__body-wrapper">
                <div class="el-form-item is-required">
                  <label class="el-form-item__label" style="width: 100px;">电子围栏名称</label>
                  <div class="el-form-item__content" style="margin-left: 100px;">
                    <div class="el-input">
                      <input id="railName" autocomplete="off" placeholder="请输入电子围栏名称" type="text" rows="2" validateevent="true" tipsplacement="top" tipsoffset="0" tipstrigger="focus" class="el-input__inner">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="el-dialog__footer">
              <div class="dialog-footer">
                ${btnClickHtml}
                <button type="button" class="el-button el-button--default" onclick="javascript:window.callJavascriptMethods({type:'closeRailAddDia'});">
                  <span>取 消</span>
                </button>
              </div>
            </div>
          </div>`
        // 弹框内容
        let anchor = {
          size: new HGIS.Size(0, 0),
          offset: new HGIS.Pixel(0, 0)
        }
        let closeBox = false
        let lonlat = {
          lon: (geometry.bounds.right + geometry.bounds.left) / 2,
          lat: (geometry.bounds.top + geometry.bounds.bottom) / 2
        }
        let id = 'addAreaDialog'
        // 声明信息弹出框
        addRailDialog = new HGIS.Popup.InfoWindow(id, lonlat,
          contentSize, titleHTML, contentHTML, anchor, closeBox, null)
        // 弹框添加到地图上
        map.addPopup(addRailDialog, true)
        addRailDialog.show()
        lonlat = new HGIS.LonLat(lonlat.lon, lonlat.lat)
        map.panTo(lonlat)
      },
      // 修改区域信息
      editArea (payload) {
        // 显示添加区域弹框
        this.showAddAreaPopUp(payload.geometry, 'edit')
        // 赋值
        document.getElementById('areaName').value = payload.data.name
        this.areaLocationObject.mapPoint = payload.data.mapPoint
        this.areaLocationObject.centerPoint = payload.data.centerPoint
        document.getElementById('areaIndexCode').value = payload.data.indexCode
        document.getElementById('areaDelay').value = payload.data.delay
        this.monitoryTableForm.id = payload.data.areaCamera.id
        this.monitoryTableForm.name = payload.data.areaCamera.name
        document.getElementById('monitoryName').value = this.monitoryTableForm.name
        this.monitoryTableForm.indexCode = payload.data.areaCamera.indexcode
        this.monitoryTableForm.deviceIndexcode = payload.data.areaCamera.deviceIndexcode
        this.areaId = payload.data.areaId
      },
      // 修改监控点位信息
      editMonitory (payload) {
        let lonlat = {
          lon: payload.xAxis,
          lat: payload.yAxis
        }
        // 显示添加监控点弹框
        this.showAddMonitoryPopUp(lonlat, 'edit')
        this.monitoryId = payload.id
        this.monitoryTableForm.name = payload.name
        document.getElementById('monitoryName').value = this.monitoryTableForm.name
        this.monitoryTableForm.indexCode = payload.indexcode
        this.monitoryTableForm.deviceIndexcode = payload.deviceIndexcode
      },
      // 修改电子围栏信息
      editRail (payload) {
        // 显示添加电子围栏弹框
        this.showAddRailPopUp(payload.geometry, 'edit')
        // 赋值
        document.getElementById('railName').value = payload.data.name
        this.railLocationObject.mapPoint = payload.data.mapPoint
        this.railLocationObject.centerPoint = payload.data.centerPoint
        this.railId = payload.data.id
      },
      // 修改区域位置
      updateAreaLocation (id) {
        areaInfoDialog.hide()
        this.$message('请单击开始绘制新的区域位置，双击结束绘制，按ESC取消')
        map.draw('polygon', vectorLayer.area, 'geometry', '修改区域位置', {
          'keepOn': false,
          'ifClear': false
        }, (geometry) => {
          let params = {
            id,
            mapId: this.mapId,
            mapPoint: geometry.toString(),
            centerPoint: geometry.getCentroid().toString()
          }
          this.$http.post(`/map/area/checkIntersect`, params).then((res) => {
            if (res.data.code === '0') {
              this.$http.post(`/map/area/update/range`, params).then((res) => {
                this.getAllMapResource()
                if (res.data.code === '0') {
                  this.$message.success('更新位置成功！')
                } else {
                  this.$message.error(res.data.msg)
                }
              })
            } else {
              this.getAllMapResource()
              this.$message.error(res.data.msg)
            }
          })
        }, null)
      },
      // 修改监控点位置
      updateMonitoryLocation (id) {
        monitoryInfoDialog.hide()
        this.$message('请点击地图上的点以修改监控点位置，按ESC取消')
        map.events.register('click', markersLayer.monitory, this.submitUpdateMonitoryLocation)
        document.addEventListener('keydown', this.cancelAddMonitory)
        this.removeSelectControl()
      },
      submitUpdateMonitoryLocation (e) {
        // 移除点击添加监控点的事件
        map.events.unregister('click', markersLayer.monitory, this.submitUpdateMonitoryLocation)
        // 同时移除esc事件
        document.removeEventListener('keydown', this.cancelAddMonitory)
        let lonLat = map.getLonLatFromPixel(e.xy)
        let params = {
          id: window.monitoryId,
          centerPointStr: new HGIS.Geometry.Point(lonLat.lon, lonLat.lat).toString()
        }
        this.$http.post(`/map/camera/update/range`, params).then((res) => {
          this.getAllMapResource()
          if (res.data.code === '0') {
            this.$message.success('更新位置成功！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 修改电子围栏位置
      updateRailLocation (id) {
        railInfoDialog.hide()
        this.$message('请单击开始绘制新的电子围栏位置，双击结束绘制按，按ESC取消')
        map.draw('polygon', vectorLayer.rail, 'geometry', '修改电子围栏位置', {
          'keepOn': false,
          'ifClear': false
        }, (geometry) => {
          let params = {
            id,
            mapId: this.mapId,
            mapPointStr: geometry.toString(),
            centerPointStr: geometry.getCentroid().toString()
          }
          this.$http.post(`/map/electronicFence/checkIntersection`, params).then((res) => {
            if (res.data.code === '0') {
              this.$http.post(`/map/electronicFence/update/range`, params).then((res) => {
                this.getAllMapResource()
                if (res.data.code === '0') {
                  this.$message.success('更新位置成功！')
                } else {
                  this.$message.error(res.data.msg)
                }
              })
            } else {
              this.getAllMapResource()
              this.$message.error(res.data.msg)
            }
          })
        }, null)
      },
      // 删除区域
      deleteArea (id) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'question'
        }).then(() => {
          this.$http.post(`/map/area/delete/${id}`, {}).then((res) => {
            if (res.data.code === '0') {
              this.getAllMapResource()
              // areaInfoDialog.contentDiv.parentNode.parentNode.parentNode.removeChild(areaInfoDialog.contentDiv.parentNode.parentNode)
              // areaInfoDialog = null
              areaInfoDialog.hide()
              this.$message.success('删除区域成功！')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
      },
      // 删除监控点
      deleteMonitory (id) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'question'
        }).then(() => {
          this.$http.post(`/map/camera/delete/${id}`, {}).then((res) => {
            if (res.data.code === '0') {
              this.getAllMapResource()
              monitoryInfoDialog.hide()
              this.$message.success('删除监控点成功！')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
      },
      // 删除电子围栏
      deleteRail (id) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'question'
        }).then(() => {
          this.$http.post(`/map/electronicFence/delete/${id}`, {}).then((res) => {
            if (res.data.code === '0') {
              this.getAllMapResource()
              railInfoDialog.hide()
              this.$message.success('删除电子围栏成功！')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
      },
      // 重置监控点表单
      resetMonitoryTableForm () {
        // 重置临时监控点表单
        this.temporaryMonitoryTableForm = {
          name: '',
          indexCode: '',
          deviceIndexCode: '',
          channelNum: ''
        }
      },
      // 打开监控点弹框
      chooseMonitory () {
        this.searchMonitoryKey = ''
        this.pagination.pageNo = 1
        this.getMonitoryTable()
        this.monitoryDialogVisible = true
        this.resetMonitoryTableForm()
      },
      // 获取监控点信息（表格）
      getMonitoryTable (pageNo) {
        let params = {
          pageNo: pageNo ? 1 : this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          cameraName: this.searchMonitoryKey
        }
        this.$http.post('/map/cameras/page', params).then((res) => {
          if (res.data.code === '0') {
            this.monitoryTable = res.data.data.result
            this.pagination.pageNo = res.data.data.pageNo
            this.pagination.total = res.data.data.total
          }
        })
      },
      // 修改监控点表格pageSize
      handleSizeChange (val) {
        this.pagination.pageSize = val
        this.getMonitoryTable()
      },
      // 监控点表格翻页
      handleCurrentChange (val) {
        this.pagination.pageNo = val
        this.getMonitoryTable()
      },
      // 点击监控点表格
      handleMonitoryTableClick (val) {
        // 防止刷新表格时选中
        if (val) {
          // this.monitoryTableForm = val
          // 存入临时表中
          this.temporaryMonitoryTableForm = val
        }
      },
      // 重置监控点
      resetMonitory () {
        this.searchMonitoryKey = ''
        this.getMonitoryTable(1)
      },
      // 确定选择监控点
      submitMonitory () {
        if (!this.temporaryMonitoryTableForm.name) {
          this.$message.error('请选择监控点!')
          return
        }
        this.monitoryDialogVisible = false
        // 将临时监控点表单浅复制给真正的监控点表单
        this.monitoryTableForm = {...this.temporaryMonitoryTableForm}
        // 赋值
        document.getElementById('monitoryName').value = this.monitoryTableForm.name
      },
      // 确定提交添加区域
      submitAddAreaForm () {
        let paramsObject = {
          name: document.getElementById('areaName').value,
          mapId: this.mapId,
          mapPoint: this.areaLocationObject.mapPoint,
          centerPoint: this.areaLocationObject.centerPoint,
          area: {
            name: document.getElementById('areaName').value,
            indexCode: document.getElementById('areaIndexCode').value,
            delay: document.getElementById('areaDelay').value
          },
          cameraInfo: {
            name: this.monitoryTableForm.name,
            indexCode: this.monitoryTableForm.indexCode,
            deviceIndexCode: this.monitoryTableForm.deviceIndexCode
          }
        }
        // 表单校验
        // 区域名称校验
        if (!paramsObject.area.name) {
          return this.$message.error('区域名称不能为空！')
        } else if (/[\\/:*?"<|'%>&+]/.test(paramsObject.area.name)) {
          return this.$message.error('不允许包含特殊字符\\/:*?"<|\'%>&+')
        } else if (paramsObject.area.name.length > 32) {
          return this.$message.error('区域名称不应超过32个字符！')
        } else if (paramsObject.area.name.match(/^\s+$/)) {
          return this.$message.error('区域名称不应为空格！')
        }
        // 区域编码校验
        if (!paramsObject.area.indexCode) {
          return this.$message.error('区域编码不能为空！')
        } else if (/[\\/:*?"<|'%>&+]/.test(paramsObject.area.indexCode)) {
          return this.$message.error('不允许包含特殊字符\\/:*?"<|\'%>&+')
        } else if (paramsObject.area.indexCode.length > 32) {
          return this.$message.error('区域编码不应超过32个字符！')
        } else if (paramsObject.area.indexCode.match(/^\s+$/)) {
          return this.$message.error('区域编码不应为空格！')
        }
        // 关联监控点校验
        if (!paramsObject.cameraInfo.name) {
          return this.$message.error('关联监控点不能为空')
        }
        // 区域延时校验
        if (paramsObject.area.delay) {
          let delayString = paramsObject.area.delay
          if (!/^[0-9]*$/.test(delayString)) {
            return this.$message.error('区域延时应为整数！')
          } else if (parseInt(delayString) > 10) {
            return this.$message.error('区域延时不应大于10！')
          }
        }
        this.$http.post('/map/area/save', {
          ...paramsObject,
          area: JSON.stringify(paramsObject.area),
          cameraInfo: JSON.stringify(paramsObject.cameraInfo)
        }).then((res) => {
          if (res.data.code === '0') {
            // addAreaDialog.contentDiv.parentNode.parentNode.parentNode.removeChild(addAreaDialog.contentDiv.parentNode.parentNode)
            // addAreaDialog = null
            addAreaDialog.hide()
            this.getAllMapResource()
            this.$message.success('添加区域成功！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 确认提交添加监控点
      submitAddMonitoryForm () {
        let params = {
          name: this.monitoryTableForm.name,
          centerPointStr: this.monitoryLocationObject.centerPointStr,
          indexcode: this.monitoryTableForm.indexCode,
          deviceIndexcode: this.monitoryTableForm.deviceIndexCode,
          mapId: this.mapId
        }
        // 表单验证
        if (!params.name) {
          return this.$message.error('关联监控点不能为空！')
        }
        this.$http.post('/map/camera/save', params).then((res) => {
          if (res.data.code === '0') {
            addMonitoryDialog.hide()
            this.getAllMapResource()
            this.$message.success('添加监控点成功！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 确认提交添加电子围栏
      submitAddRailForm () {
        let params = {
          name: document.getElementById('railName').value,
          mapId: this.mapId,
          mapPointStr: this.railLocationObject.mapPoint,
          centerPointStr: this.railLocationObject.centerPoint
        }
        if (!params.name) {
          return this.$message.error('电子围栏名称不能为空！')
        } else if (/[\\/:*?"<|'%>&+]/.test(params.name)) {
          return this.$message.error('不允许包含特殊字符\\/:*?"<|\'%>&+')
        } else if (params.name.length > 32) {
          return this.$message.error('电子围栏名称不应超过32个字符！')
        } else if (params.name.match(/^\s+$/)) {
          return this.$message.error('电子围栏名称不应为空格！')
        }
        this.$http.post('/map/electronicFence/save', params).then((res) => {
          if (res.data.code === '0') {
            // addAreaDialog.contentDiv.parentNode.parentNode.parentNode.removeChild(addAreaDialog.contentDiv.parentNode.parentNode)
            // addAreaDialog = null
            addRailDialog.hide()
            this.getAllMapResource()
            this.$message.success('添加电子围栏成功！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 确定提交修改区域信息
      updateAreaInfo () {
        let paramsObject = {
          area: {
            areaId: this.areaId,
            name: document.getElementById('areaName').value,
            indexCode: document.getElementById('areaIndexCode').value,
            delay: document.getElementById('areaDelay').value
          },
          cameraInfo: {
            id: this.monitoryTableForm.id,
            name: this.monitoryTableForm.name,
            indexCode: this.monitoryTableForm.indexCode,
            deviceIndexCode: this.monitoryTableForm.deviceIndexcode
          }
        }
        // 表单校验
        // 区域名称校验
        if (!paramsObject.area.name) {
          return this.$message.error('区域名称不能为空！')
        } else if (/[\\/:*?"<|'%>&+]/.test(paramsObject.area.name)) {
          return this.$message.error('不允许包含特殊字符\\/:*?"<|\'%>&+')
        } else if (paramsObject.area.name.length > 32) {
          return this.$message.error('区域名称不应超过32个字符！')
        } else if (paramsObject.area.name.match(/^\s+$/)) {
          return this.$message.error('区域名称不应为空格！')
        }
        // 区域编码校验
        if (!paramsObject.area.indexCode) {
          return this.$message.error('区域编码不能为空！')
        } else if (/[\\/:*?"<|'%>&+]/.test(paramsObject.area.indexCode)) {
          return this.$message.error('不允许包含特殊字符\\/:*?"<|\'%>&+')
        } else if (paramsObject.area.indexCode.length > 32) {
          return this.$message.error('区域编码不应超过32个字符！')
        } else if (paramsObject.area.indexCode.match(/^\s+$/)) {
          return this.$message.error('区域编码不应为空格！')
        }
        // 关联监控点校验
        if (!paramsObject.cameraInfo.name) {
          return this.$message.error('关联监控点不能为空')
        }
        // 区域延时校验
        if (paramsObject.area.delay) {
          let delayString = paramsObject.area.delay
          if (!/^[0-9]*$/.test(delayString)) {
            return this.$message.error('区域延时应为整数！')
          } else if (parseInt(delayString) > 10) {
            return this.$message.error('区域延时不应大于10！')
          }
        }
        this.$http.post('/map/area/update/content', {
          area: JSON.stringify(paramsObject.area),
          cameraInfo: JSON.stringify(paramsObject.cameraInfo)
        }).then((res) => {
          if (res.data.code === '0') {
            // addAreaDialog.contentDiv.parentNode.parentNode.parentNode.removeChild(addAreaDialog.contentDiv.parentNode.parentNode)
            // addAreaDialog = null
            // if (areaInfoDialog) {
            //   areaInfoDialog.contentDiv.parentNode.parentNode.parentNode.removeChild(areaInfoDialog.contentDiv.parentNode.parentNode)
            //   areaInfoDialog = null
            // }
            addAreaDialog.hide()
            this.getAllMapResource()
            this.$message.success('修改区域成功！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 确定提交修改监控点信息
      updateMonitoryInfo () {
        let params = {
          id: this.monitoryId,
          name: this.monitoryTableForm.name,
          indexcode: this.monitoryTableForm.indexCode,
          deviceIndexcode: this.monitoryTableForm.deviceIndexCode,
          mapId: this.mapId
        }
        // 表单校验
        if (!params.name) {
          return this.$message.error('关联监控点不能为空！')
        }
        this.$http.post('/map/camera/update', params).then((res) => {
          if (res.data.code === '0') {
            addMonitoryDialog.hide()
            this.getAllMapResource()
            this.$message.success('修改监控点成功！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 确认提交修改电子围栏信息
      updateRailInfo () {
        let params = {
          id: this.railId,
          name: document.getElementById('railName').value
        }
        // 表单校验
        if (!params.name) {
          return this.$message.error('电子围栏名称不能为空！')
        } else if (/[\\/:*?"<|'%>&+]/.test(params.name)) {
          return this.$message.error('不允许包含特殊字符\\/:*?"<|\'%>&+')
        } else if (params.name.length > 32) {
          return this.$message.error('电子围栏名称不应超过32个字符！')
        } else if (params.name.match(/^\s+$/)) {
          return this.$message.error('电子围栏名称不应为空格！')
        }
        this.$http.post('/map/electronicFence/update/content', params).then((res) => {
          if (res.data.code === '0') {
            addRailDialog.hide()
            this.getAllMapResource()
            this.$message.success('修改电子围栏成功！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 地图操作按钮动作
      zoom (type) {
        if (type === 0) { // 原始比例与中心
          map.setCenter(window.center, window.initLevel)
        } else if (type === 1) { // 放大
          map.zoomIn()
        } else { // 缩小
          map.zoomOut()
        }
      }
    },
    mounted () {
      // this.getLocationSystem()
      this.getMapTree()
    },
    props: ['methodsParams'],
    watch: {
      methodsParams ({type, payload}) {
        switch (type) {
          // 关闭添加区域弹框
          case 'closeAreaAddDia':
            // 重新获取资源，刷掉添加中断添加的区域
            this.getAllMapResource()
            addAreaDialog.hide()
            // addAreaDialog.contentDiv.parentNode.parentNode.parentNode.removeChild(addAreaDialog.contentDiv.parentNode.parentNode)
            // addAreaDialog = null
            break
          // 关闭区域信息弹框
          case 'closeAreaInfoDia':
            // this.getAllMapResource()
            areaInfoDialog.hide()
            // areaInfoDialog.contentDiv.parentNode.parentNode.parentNode.removeChild(areaInfoDialog.contentDiv.parentNode.parentNode)
            // areaInfoDialog = null
            break
          // 提交添加区域表单
          case 'submitAddAreaForm':
            this.submitAddAreaForm()
            break
          // 修改区域信息
          case 'editArea':
            this.editArea(payload)
            break
          // 修改区域信息
          case 'updateAreaInfo':
            this.updateAreaInfo()
            break
          // 修改区域位置
          case 'updateAreaLocation':
            this.updateAreaLocation(payload)
            break
          // 删除区域
          case 'deleteArea':
            this.deleteArea(payload)
            break
          // 关闭电子围栏新增弹框
          case 'closeRailAddDia':
            this.getAllMapResource()
            addRailDialog.hide()
            break
          // 关闭电子围栏信息弹框
          case 'closeRailInfoDia':
            // this.getAllMapResource()
            railInfoDialog.hide()
            break
          // 新增电子围栏
          case 'submitAddRailForm':
            this.submitAddRailForm()
            break
          // 修改电子围栏
          case 'editRail':
            this.editRail(payload)
            break
          // 确认修改电子围栏
          case 'updateRailInfo':
            this.updateRailInfo()
            break
          // 修改电子围栏信位置
          case 'updateRailLocation':
            this.updateRailLocation(payload)
            break
          // 删除电子围栏
          case 'deleteRail':
            this.deleteRail(payload)
            break
          // 关闭监控点新增弹框
          case 'closeMonitoryAddDia':
            this.getAllMapResource()
            addMonitoryDialog.hide()
            break
          // 关闭监控点信息弹框
          case 'closeMonitoryInfoDia':
            // this.getAllMapResource()
            monitoryInfoDialog.hide()
            break
          // 新增监控点
          case 'submitAddMonitoryForm':
            this.submitAddMonitoryForm()
            break
          // 修改监控点
          case 'editMonitory':
            this.editMonitory(payload)
            break
          // 确认修改监控点信息
          case 'updateMonitoryInfo':
            this.updateMonitoryInfo()
            break
          // 修改监控点位置
          case 'updateMonitoryLocation':
            this.updateMonitoryLocation(payload)
            break
          // 删除监控点
          case 'deleteMonitory':
            this.deleteMonitory(payload)
            break
          // 选择监控点
          case 'chooseMonitory':
            this.chooseMonitory()
            break
          case 'resetMap':
            this.resetMap()
            break
          default:
            console.log(1)
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @leftWidth: 280px;

  .mapConfig {
    position: relative;
    width: 100%;
    height: 100%;
    .leftTree {
      position: relative;
      float: left;
      width: @leftWidth;
      height: 100%;
      border-right: 1px solid #e5e5e5;
      box-sizing: border-box;
      background: #fff;
      z-index: 2;
      .leftTitle {
        height: 64px;
        line-height: 64px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        padding-left: 16px;
        border-bottom: 1px solid #e5e5e5;
        box-sizing: border-box;
      }
      .leftContent {
        position: relative;
        height: calc(~"100% - 64px");
        padding: 0 16px;
        .btnContent {
          height: 64px;
          line-height: 64px;
          .el-button {
            /*margin: 0 6px;*/
          }
        }
        .treeContent {
          height: calc(~"100% - 65px");
          border-top: 1px solid #e5e5e5;
          border-left: 1px solid #e5e5e5;
          border-right: 1px solid #e5e5e5;
        }
      }
    }
    .rightWrapper {
      position: relative;
      height: 100%;
      background: #f2f2f2;
      padding: 8px 8px 8px calc(@leftWidth + 8px);
      box-sizing: border-box;
      z-index: 1;
      .rightContent {
        position: relative;
        height: 100%;
        background: #fff;
        .rightHeader {
          height: 64px;
          line-height: 64px;
          padding-left: 16px;
          border-bottom: 1px solid #e5e5e5;
          box-sizing: border-box;
          .rightTitle {
            font-size: 16px;
            font-weight: bold;
          }
          .el-button {
            position: absolute;
            top: 17px;
            right: 16px;
          }
        }
        .mapWrapper {
          position: relative;
          height: calc(~"100% - 64px");
          .mapContent {
            position: relative;
            height: 100%;
            z-index: 1;
          }
          .searchContent {
            display: none;
            position: absolute;
            width: 416px;
            top: 17px;
            left: 16px;
            z-index: 3;
            .searchInput {
              width: 416px;
              height: 32px;
              padding: 6px 8px;
              border: 1px solid #ccc;
              border-radius: 2px;
              box-sizing: border-box;
              box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.20);
            }
            .searchResultContent {
              width: 100%;
              height: 393px;
              margin-top: 4px;
              border: 1px solid #ccc;
              border-radius: 2px;
              box-sizing: border-box;
              box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.20);
              background: #fff;
              .searchResultHeader {
                width: 100%;
                height: 40px;
                line-height: 40px;
                padding-left: 8px;
                border-bottom: 1px solid #e5e5e5;
                box-sizing: border-box;
                cursor: pointer;
                .searchResultType {
                  margin: 0 2px;
                  &.active {
                    color: #2C65D6;
                  }
                }
              }
              .searchResultList {
                height: 352px;
                .searchResultItem {
                  height: 32px;
                  line-height: 32px;
                  padding-left: 8px;
                  cursor: pointer;
                }
              }
            }
          }
          .btnContent {
            position: absolute;
            top: 17px;
            right: 64px;
            width: 303px;
            height: 32px;
            line-height: 30px;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.20);
            background: #fff;
            z-index: 3;
            .btn {
              display: inline-block;
              margin-left: 6px;
              cursor: pointer;
              &:after {
                display: inline-block;
                content: '';
                width: 1px;
                height: 12px;
                margin-left: 8px;
                vertical-align: middle;
                background: #e5e5e5;
              }
              &:last-child:after {
                display: none;
              }
              .icon-addArea {
                background: url("../../assets/addArea.png") no-repeat;
              }
              .icon-addMonitory {
                background: url("../../assets/addMonitory.png") no-repeat;
              }
              .icon-addRail {
                background: url("../../assets/addRail.png") no-repeat;
              }
              .icon-addStation {
                background: url("../../assets/addStation.png") no-repeat;
              }
              span {
                display: inline-block;
                vertical-align: middle;
              }
              i {
                display: inline-block;
                width: 17px;
                height: 16px;
                line-height: 30px;
                margin-right: 4px;
                vertical-align: middle;
              }
            }
          }
        }
      }
    }

    .addMapContent {
      .picNameContent {
        width: calc(~"100% - 86px");
      }
      .mapTips {
        font-size: 12px;
        color: #8484a4;
        margin-bottom: -16px;
      }
      .chooseMapBtn {
        position: relative;
        display: inline-block;
        width: 80px;
        height: 32px;
        vertical-align: middle;
        text-align: center;
        text-decoration: none;
        border: 1px solid #e5e5e5;
        color: #666;
        cursor: pointer;
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 32px;
          opacity: 0;
        }
      }
    }

    .el-dialog {
      .el-dialog__body-wrapper {
        padding: 0 15px !important;
        .el-tag {
          line-height: 22px;
        }
      }
    }

    .addAreaDialog {
      .el-dialog__body-wrapper {
        padding: 0 15px !important;
        .el-tag {
          line-height: 22px;
        }
      }
      .monitoryPointName {
        width: calc(~"100% - 89px");
      }
      .chooseMonitoryBtn {
        position: relative;
        display: inline-block;
        width: 80px;
        height: 32px;
        vertical-align: middle;
        text-align: center;
        text-decoration: none;
        border: 1px solid #e5e5e5;
        color: #666;
        cursor: pointer;
      }
    }

    .chooseMonitoryDialog {
      .el-dialog__body {
        padding: 0 5px;
      }
      .tableWrapper {
        position: relative;
        height: 100%;
        .header {
          padding: 8px 0;
          .searchMonitoryLabel {
            font-size: 12px;
            line-height: 32px;
          }
          .el-form-item {
            margin-bottom: 0;
          }
          .monitoryName {
            float: left;
          }
          .monitoryBtn {
            float: right;
          }
        }
        .content {
          height: 400px;
          padding-bottom: 48px;
          box-sizing: border-box;
        }
        .bottom {
          position: absolute;
          bottom: 0;
          height: 48px;
          width: 100%
        }
      }
    }

    .areaInfoDialog {
      .el-dialog__header {
        .el-dialog__headerbtn {
          width: 40px;
          i {
            width: 40px;
            font-size: 16px;
            line-height: 39px;
          }
        }
      }
    }

    .hgis_FramedCloudPopupContent {
      overflow: hidden;
    }

    .olPopup {
      font-family: "Segoe UI", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
    }

    .olControlZoom {
      bottom: 38px;
      /*a {*/
        /*height: 32px;*/
        /*width: 32px;*/
        /*color: #666;*/
        /*line-height: 32px;*/
        /*background: #ffffff;*/
        /*box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.20);*/
        /*&:hover {*/
          /*background: #f2f2f2;*/
        /*}*/
      /*}*/
    }

    .zoomBar {
      width: 28px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 4px;
      padding: 2px;
      z-index: 1001;
      position: absolute;
      bottom: 8px;
      right: 8px;
      box-sizing: border-box;
      .zoomblock {
        width: 22px;
        height: 22px;
        border-radius: 4px;
        margin: 1px;
        background-color: rgba(0, 60, 136, 0.5);
        font-size: 18px;
        color: #fff;
        font-weight: bold;
        text-align: center;
        line-height: 19px;
        display: block;
        cursor: pointer;
        font-family: 'Lucida Grande', Verdana, Geneva, Lucida, Arial, Helvetica, sans-serif;
        &.homeIcon {
          background-image: url("../../../static/images/icon-zoomhome.png");
        }
        &:hover {
          background-color: rgba(0, 60, 136, 0.7);
        }
      }
    }

    .el-dialog__title {
      display: inline-block;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: text-bottom;
    }

    .dialog-span {
      display: inline-block;
      width: 210px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: top;
    }

    .olControlZoom {
      display: none;
    }

    .fileInput {
      font-size: 0;
    }
  }
</style>
