// 新增全局变量用于记录mission_id，初始值为331270
let missionId = 331270;

// 切换绘制状态
let points = [];
let isDrawing = false;
let currentPolyline = null;
function toggleDrawing() {
    isDrawing = !isDrawing;
    const button = document.getElementById('drawing-toggle'); 
    
    if (isDrawing) {
        // 高德地图通过AMap.event 监听点击事件 
         window.largeMap .on('click',  addPoint);
        button.textContent  = '关闭绘制';
        button.style.backgroundColor  = '#ffc107';
        button.style.color  = '#212529';
    } else {
         window.largeMap .off('click',  addPoint); // 移除事件监听 
        button.textContent  = '✨开始绘制';
        button.style.backgroundColor  = '';
        button.style.color  = '';
    }
}

// 添加坐标点（保持不变）
function addPoint(e) {
    const coord = e.lnglat; 
    console.log(' 添加航点:', coord);
 
 
    const label = new AMap.Text({
        text: (points.length  + 1).toString(),
        position: coord,
        style: {
            'background-color': '#007BFF',
            'color': 'white',
            'border-radius': '50%',
            'padding': '3px 6px',
            'font-size': '12px',
            'text-align': 'center'
        },
        offset: new AMap.Pixel(-10, -8) // 微调定位 
    });
    label.setMap( window.largeMap ); 
 
    points.push({  
        coord, 
        label,
        marker: label // 兼容原数据结构 
    });
    updatePolyline();
}

// 删除最后一个航点（保持不变）
function removeLastPoint() {
    if (points.length  === 0) {
        AMap.ui.showToast({  content: '没有可删除的航点！', type: 'error' });
        return;
    }
 
    const lastPoint = points.pop(); 
    lastPoint.marker.setMap(null);  // 高德地图移除标记方法 
    lastPoint.label.setMap(null); 
    updatePolyline();
 
    // 更新剩余航点编号 
    points.forEach((point,  index) => {
        point.label.setText((index  + 1).toString());
    });
}

// 更新航线（保持不变）
function updatePolyline() {
    // 移除旧航线（高德通过setMap(null)移除覆盖物）
    if (currentPolyline) {
        currentPolyline.setMap(null); 
    }
 
    // 创建新航线（需至少2个点）
    if (points.length  >= 2) {
       const path = points.map(p  => [p.coord.getLng(), p.coord.getLat()]);
        
        currentPolyline = new AMap.Polyline({
            path: path,
            strokeColor: "#28a745", // 线颜色 
            strokeWeight: 4,        // 线宽 
            strokeStyle: "solid",   // 线样式（solid|dash） 
            strokeDasharray: [5, 5], // 虚线间隔（高德使用数组而非字符串）
            lineJoin: "round",       // 折线拐点样式 
            opacity: 0.8,
            zIndex: 50              // 层级控制 
        });
        
        currentPolyline.setMap( window.largeMap );  // 添加到地图 
    }
}

// 清空所有要素（保持不变）
function clearAll() {
    if(points.length === 0) {
        alert('当前没有航点可清除！');
        return;
    }

    if(confirm('确定要清除所有航点和航线吗？')) {
        // 清除所有标记和标签 
        points.forEach(p  => {
            p.marker.setMap(null); 
            p.label.setMap(null);  // 假设label是高德的AMap.Text对象 
        });
        
        // 清除航线 
        if (currentPolyline) currentPolyline.setMap(null); 
        
        // 重置数据 
        points = [];
        currentPolyline = null;
        AMap.ui.showToast({  content: "清除完成", type: "success" });
    }
}   

// 切换执行面板显示/隐藏（保持不变）
function toggleExecutionPanel() {
    const panel = document.getElementById('execution-panel');
    panel.classList.toggle('show');
    
    // 如果航点少于2个且面板显示，则显示警告
    if(points.length < 2 && panel.classList.contains('show')) {
        alert('警告：至少需要2个航点才能执行航线！');
    }
}

// 执行航线（修改部分：添加调用hangdianhxzx）
function executeFlight() {
    if(points.length < 2) {
        alert('执行失败：至少需要2个航点才能执行航线！');
        return;
    }
    
    const flightHeight = parseFloat(document.getElementById('flight-height').value);
    const flightSpeed = parseFloat(document.getElementById('flight-speed').value);
    const returnHeight = parseFloat(document.getElementById('return-height').value);
    const lostAction = document.getElementById('lost-action').value;
    
    // 验证输入
    if (isNaN(flightHeight) || isNaN(flightSpeed) || isNaN(returnHeight)) {
        alert('请输入有效的数值参数！');
        return;
    }
    
    if (flightHeight < 10 || flightSpeed < 1 || returnHeight < 10) {
        alert('参数值不能小于最小值限制！');
        return;
    }
    
    // 打印航线信息
    console.log('开始执行航线...');
    console.log('航线参数:', {
        flightHeight,
        flightSpeed,
        returnHeight,
        lostAction
    });
    
    console.log('航点列表:');
    points.forEach((point, index) => {
        console.log(`航点 ${index + 1}:`, point.coord);
    });
    
    // 显示执行结果
    const resultMessage = `航线已开始执行！
航点数量: ${points.length}个
航线高度: ${flightHeight}米
航线速度: ${flightSpeed}米/秒
返航高度: ${returnHeight}米
失联动作: ${document.getElementById('lost-action').options[document.getElementById('lost-action').selectedIndex].text}`;
    
    alert(resultMessage);
    
    // 关闭面板
    toggleExecutionPanel();
   //航线获取控制权
	hangdianhxzxkzq();
    // 调用航点处理函数，传递必要参数
    hangdianhxzx(flightHeight, flightSpeed, lostAction);
	//航线开始执行
	const timerId = setTimeout(() => {
			  //console.log("2秒后执行");
			  hangdianhxzxstat();
			}, 2000);
}

function hangdianhxzxstat() {
   // console.log('航线stat');
    // 构建JSON数据
    const jsonData = {

	  "datahead": "flight waypoint2 start",
	  "data": {
		"null": "null"
	  },
	  "datatype": 53,
	  "dataextratype": 0,
	  "imei": "eFzn49GF6iJn0po715+xdw==",
	  "dataLen": 17
    };
    // 序列化为JSON字符串并发送
    const jsonStr = JSON.stringify(jsonData);
    mqtt.publish(MQTTXterminals, jsonStr); 	
}


			
function hangdianhxzxkzq() {
   // console.log('航线控制权');
    // 构建JSON数据
    const jsonData = {
		"datatype": 140,
		"datahead": "flight obtain joystick ctrl authority",
		"datalen": 17,
		"data": {
			"null": null
		},
		"imei": "InF3dWaXQjzH+xZF1fgqCA=="
    };
    // 序列化为JSON字符串并发送
    const jsonStr = JSON.stringify(jsonData);
    mqtt.publish(MQTTXterminals, jsonStr); 	
}			
					

// 修改后的航点处理函数
function hangdianhxzx(flightHeight, flightSpeed, lostAction) {
    // 1. 先将经纬度转换为GCJ02坐标系，再转换为弧度（度 -> 弧度：弧度 = 度 * π / 180）
    const radianPoints = points.map(point => {
        // 获取原始经纬度（度）
        const rawLng = point.coord.getLng(); // 原始经度
        const rawLat = point.coord.getLat(); // 原始纬度
       // console.log("原始lng", rawLng); // 如需调试可取消注释
        // 转换为GCJ02坐标系
        let gcjLng, gcjLat;
		 if (typeof rawLng === 'number' && typeof rawLat === 'number') {
            const transformed = CoordTransform.gcj02towgs84(rawLng, rawLat);
            gcjLng = transformed.lng;
            gcjLat = transformed.lat;
		 }
         //console.log("转化lng", gcjLng); // 如需调试可取消注释
        
        // 将GCJ02坐标系的经纬度转换为弧度
        return {
            longitude: gcjLng * Math.PI / 180, // 经度转弧度
            latitude: gcjLat * Math.PI / 180   // 纬度转弧度
        };
    });

    // 2. 构建mission数组（动态生成航点数据）
    const mission = radianPoints.map(radPoint => ({
        "turn_mode": 0,          
        "max_flight_speed": flightSpeed,  // 使用传入的飞行速度
        "waypoint_type": 2,       
        "auto_flight_speed": flightSpeed, // 自动飞行速度
        "heading": 0,              
        "damping_distance": 40,      
        "latitude": radPoint.latitude,    // 弧度纬度
        "point_of_interest": {
            "position_x": 0,
            "position_y": 0,
            "position_z": 0
        },
        "config": {
            "use_local_max_vel": 0,
            "use_local_cruise_vel": 0
        },
        "relative_height": flightHeight,  // 使用传入的飞行高度
        "heading_mode": 0,
        "longitude": radPoint.longitude   // 弧度经度
    }));

    // 3. 构建完整JSON数据
    const jsonData = {
        "datahead": "flight waypoint2 upload mission",
        "data": {
            "action_when_rc_lost": lostAction === "return" ? 1 : 2, // 根据实际选项映射
            "max_flight_speed": flightSpeed,   
            "mission": mission,
            "auto_flight_speed": flightSpeed,
            "miss_total_len": points.length,     
            "action_list": {
                "action_num": 0,
                "actions": []
            },
            "goto_first_waypoint_mode": 0,
            "finished_action": 1,
            "mission_id": missionId,         // 使用当前missionId
            "repeat_times": 0
        },
        "datatype": 52,                          
        "dataextratype": 0,
        "imei": "eFzn49GF6iJn0po715+xdw==",
        "dataLen": 0 // 先占位，后续计算
    };

    // 4. 计算dataLen（JSON字符串长度）
    const jsonStr = JSON.stringify(jsonData);
    jsonData.dataLen = jsonStr.length; // 更新数据长度

    // 5. 发送数据
    mqtt.publish(MQTTXterminals, jsonStr); 	
    
    // 6. mission_id自动加1（下次使用时递增）
    missionId++;
}

function daorukml() {
    confirm('仅支持kml格式')
 // 获取隐藏的文件选择控件
  const fileInput = document.getElementById('fileSelector');
  
  // 重置文件选择器（避免重复选择同一文件时无法触发change事件）
  fileInput.value = '';
  
  // 触发文件选择对话框
  fileInput.click();
  
  // 监听文件选择事件
  fileInput.onchange = function(e) {
    // 获取选择的文件（只取第一个文件）
    const file = e.target.files[0];
    
    if (!file) {
      console.log('未选择文件');
      return;
    }
    
    // 验证文件类型（双重保险，虽然accept已经限制，但仍需前端验证）
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('请选择txt格式的文件！');
      return;
    }
    
    console.log('已选择文件：', file.name);
    
    // 读取文件内容（如果需要处理文件内容，可使用以下代码）
    const reader = new FileReader();
    
    // 读取成功后的回调
    reader.onload = function(event) {
      const fileContent = event.target.result;
      console.log('文件内容：', fileContent);
      // 这里可以添加处理航线数据的逻辑（如解析坐标、展示等）
      alert(`成功读取文件：${file.name}\n文件大小：${file.size}字节`);
	  confirm('暂不支持此文件')
    };
    
    // 读取失败的回调
    reader.onerror = function() {
      alert('文件读取失败，请重试！');
    };
    
    // 以文本格式读取文件
    reader.readAsText(file, 'utf-8');
  };
}

function daochukml() {
    confirm('暂时不支持')
    // 直接根据状态选择数据，同时定义数据（简化结构）

}
