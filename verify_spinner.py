from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_loading_spinner(page: Page):
    page.goto("http://localhost:3000/agendamento")

    # Check Voltar button is a link (semantic check)
    voltar_link = page.locator("a:has-text('Voltar para o início')")
    expect(voltar_link).to_be_visible()

    # Step 1: Select Date and Time
    try:
        page.get_by_role("button", name="Go to next month").click()
    except:
        pass

    page.get_by_role("gridcell").nth(20).click()

    # Pick an enabled time slot
    for btn in page.get_by_role("button").all():
        txt = btn.text_content()
        if ":" in txt and not btn.is_disabled():
            btn.click()
            break

    page.get_by_role("button", name="Continuar").click()

    # Step 2: Fill form
    page.wait_for_selector("text=Seus Dados")

    page.get_by_label("Seu Nome").fill("Teste Palette")
    page.get_by_label("WhatsApp / Telefone").fill("(11) 99999-9999")

    # Click "Confirmar Agendamento"
    submit_btn = page.get_by_role("button", name="Confirmar Agendamento")
    submit_btn.click()

    # Wait a bit for React to update state
    page.wait_for_timeout(100) # 100ms should be enough to render spinner but before timeout/error

    page.screenshot(path="/home/jules/verification/agendamento_spinner.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_loading_spinner(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error_final_2.png")
        finally:
            browser.close()
