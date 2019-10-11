import { MessageBox } from 'element-ui'
import router from '../router/index'
// var baseurl='http://192.168.1.146:8011/';
 var baseurl='/API/';
function upmorefile(file,url,call){
    var fileObj = file; // 获取文件对象
    console.log(file)
    var FileController = baseurl+url;     // 接收上传文件的后台地址 
    // FormData 对象  
	for (var i = 0; i < fileObj.length; i++){	
    	var form = new FormData();  
	    form.append("file", fileObj[i]);       // 文件对象
	    // XMLHttpRequest 对象
	    console.log(fileObj[i])
	    var xhr = new XMLHttpRequest();
	    xhr.open("post", FileController, true);
	    xhr.onload = function (data) {
            var a=data.target.responseText;
            var b=JSON.parse(a);
            if(b.Status ==400 ){
                MessageBox.alert('登录超时', '失败', {
                    confirmButtonText: '确定',
                    callback: action => {
                        localStorage.clear();
                        router.push({ path: "/" });
                    }
                  });            
                return;
              };
              if(b.Status ==401 ){
                  router.push({ path: "/error/401" });
                  return;
                };
            call(b);
	    };
	    xhr.send(form);
    }
}
export default upmorefile