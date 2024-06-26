import I18n from "i18n-js";
import { assign } from "lodash";

/* istanbul ignore next */
I18n.translations = I18n.translations || {};

I18n.translations.en = assign({}, I18n.translations.en, {
  validated_form: {
    validation_summary: {
      title: {
        one: "There is %{count} error",
        other: "There are %{count} errors",
      },
    },
  },
});
