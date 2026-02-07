package com.mita.pwa;

import android.os.Bundle;
import android.content.Intent;
import com.getcapacitor.BridgeActivity;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;

public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (this.bridge != null && this.bridge.getPlugin("SocialLogin") != null) {
      SocialLoginPlugin plugin = (SocialLoginPlugin) this.bridge.getPlugin("SocialLogin").getInstance();
      if (plugin != null) {
        plugin.handleGoogleLoginIntent(requestCode, data);
      }
    }
  }

  @Override
  public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {
    // This method is required by the plugin interface
  }
}
