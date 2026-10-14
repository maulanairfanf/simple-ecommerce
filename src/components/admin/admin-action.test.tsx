import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminActionGroup, AdminButton } from "@/components/admin/admin-action";

describe("admin action primitives", () => {
  it("renders grouped actions with shared variants", () => {
    const markup = renderToStaticMarkup(
      <AdminActionGroup>
        <AdminButton type="button" variant="text">
          Edit
        </AdminButton>
        <AdminButton type="button" variant="danger">
          Archive
        </AdminButton>
      </AdminActionGroup>,
    );

    expect(markup).toContain("admin-action-group");
    expect(markup).toContain("admin-button-text");
    expect(markup).toContain("admin-button-danger");
  });

  it("disables a pending action and exposes its loading label", () => {
    const markup = renderToStaticMarkup(
      <AdminButton isLoading loadingLabel="Saving..." type="submit">
        Save product
      </AdminButton>,
    );

    expect(markup).toContain("disabled");
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain("Saving...");
  });
});
