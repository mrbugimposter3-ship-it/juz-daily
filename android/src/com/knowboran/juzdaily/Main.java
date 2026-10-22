package com.knowboran.juzdaily;
import android.app.Activity;import android.os.Bundle;import android.webkit.*;import android.content.Intent;import android.net.Uri;import android.view.WindowManager;
public class Main extends Activity{WebView w;
protected void onCreate(Bundle b){super.onCreate(b);getWindow().setStatusBarColor(0xff062a1f);getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);w=new WebView(this);w.addJavascriptInterface(new Wake(),"AndroidWake");
WebSettings s=w.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(true);s.setAllowFileAccessFromFileURLs(true);s.setAllowUniversalAccessFromFileURLs(true);s.setMediaPlaybackRequiresUserGesture(false);
w.setWebViewClient(new WebViewClient(){public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){Uri u=r.getUrl();String sc=u.getScheme();if("http".equals(sc)||"https".equals(sc)){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){}return true;}return false;}});
s.setSupportMultipleWindows(false);w.loadUrl("file:///android_asset/www/index.html");setContentView(w);}
/* ☀️ toggle in the app: keep the screen on (default) or let it time out */
class Wake{@JavascriptInterface public void set(final boolean on){runOnUiThread(new Runnable(){public void run(){if(on)getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);}});}}
public void onBackPressed(){w.evaluateJavascript("(function(){if(location.hash){home();return 1}return 0})()",new ValueCallback<String>(){public void onReceiveValue(String v){if(!"1".equals(v))finish();}});}}
