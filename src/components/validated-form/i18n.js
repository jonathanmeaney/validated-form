import I18n from "i18n-js";
import { assign } from "lodash";

I18n.translations = I18n.translations || {};

I18n.translations.en = assign({}, I18n.translations.en, {
  validated_form: {
    validation_summary: {
      title: "There are %{count} errors",
    },
  },
});
